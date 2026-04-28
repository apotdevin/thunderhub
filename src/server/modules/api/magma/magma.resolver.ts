import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import { auto } from 'async';
import { v5 as uuidv5 } from 'uuid';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { NodeService } from '../../node/node.service';
import { FetchService } from '../../fetch/fetch.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from '../../../utils/async';
import { TapFederationService } from '../tapd/tapd-federation.service';
import { AmbossTokenService } from '../amboss/amboss-token.service';
import { AmbossService } from '../amboss/amboss.service';
import { GetRecommendedNode } from '../amboss/amboss.gql';
import {
  TradeReadinessResult,
  OfferReadinessInput,
  OfferReadinessResult,
  RecommendedNode,
} from '../trade/trade.types';
import {
  GetTapOffersInput,
  TapTradeOfferList,
  TapSupportedAssetList,
  TapTransactionType,
  SetupTradeCapacityInput,
  SetupTradeCapacityResult,
  SetupTradeCapacityAuto,
  MagmaPendingOrders,
  MagmaOrder,
  AmbossOrderRaw,
  AmbossOrderList,
  CancelMagmaOrderInput,
  CancelMagmaOrderResult,
  MagmaOrderInvoice,
  MagmaQueries,
  MagmaOrderQueries,
  MagmaMutations,
  RailsQueries,
} from './magma.types';
import {
  getOffersQuery,
  getSupportedAssetsQuery,
  createMagmaOrderMutation,
  getOrdersQuery,
  getOrderPaymentQuery,
  cancelMagmaOrderMutation,
} from './magma.gql';

/**
 * Magma "size" semantics by direction:
 *   - PURCHASE (buying an asset channel): atomic asset units — `assetAmount` is used directly.
 *   - SALE (buying a sats channel): sats — derived from `assetAmount` via `assetRate`
 *     (which is atomic-assets-per-BTC).
 */
function computeMagmaOrderSize(
  transactionType: TapTransactionType,
  assetAmount: string,
  assetRate: string
): string {
  if (transactionType === TapTransactionType.PURCHASE) {
    return assetAmount;
  }

  // SALE: atomic_asset_units * 1e8 / rate = sats
  return (
    (BigInt(assetAmount) * BigInt(100_000_000)) /
    BigInt(assetRate)
  ).toString();
}

// Internal shapes matching the trade API GraphQL responses

interface TradeApiOffer {
  id: string;
  magma_offer_id: string;
  node?: { alias?: string; pubkey?: string; sockets?: string[] };
  rate?: { display_amount?: string; full_amount?: string };
  available?: { display_amount?: string; full_amount?: string };
  min_order?: { display_amount?: string; full_amount?: string };
  max_order?: { display_amount?: string; full_amount?: string };
  fees?: { base_fee_sats?: number; fee_rate_ppm?: number };
  asset?: {
    id?: string;
    symbol?: string;
    precision?: number;
    taproot_asset_details?: { asset_id?: string; group_key?: string };
  };
}

interface TradeApiSupportedAsset {
  id: string;
  symbol?: string;
  description?: string;
  precision?: number;
  taproot_asset_details?: {
    asset_id?: string;
    group_key?: string;
    universe?: string;
  };
  prices?: { id?: string; usd?: number };
}

@Resolver()
export class MagmaResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    private nodeService: NodeService,
    private fetchService: FetchService,
    private ambossTokenService: AmbossTokenService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // ── Trade Capacity Setup ──

  @Mutation(() => SetupTradeCapacityResult)
  async setupTradeCapacity(
    @CurrentUser() user: UserId,
    @Args('input') input: SetupTradeCapacityInput
  ): Promise<SetupTradeCapacityResult> {
    const ambossAuth = await this.ambossTokenService.getOrCreate(user);
    const result = await auto<SetupTradeCapacityAuto>({
      validate: async (): Promise<SetupTradeCapacityAuto['validate']> => {
        if (!input.assetAmount || BigInt(input.assetAmount) <= 0) {
          throw new GraphQLError('Asset amount must be greater than zero');
        }
        if (!input.assetRate || BigInt(input.assetRate) <= 0) {
          throw new GraphQLError('Asset rate must be greater than zero');
        }
        if (!input.magmaOfferId) {
          throw new GraphQLError('Magma offer ID is required');
        }
        if (!input.swapNodePubkey) {
          throw new GraphQLError('Swap node pubkey is required');
        }
        if (!input.tapdAssetId && !input.tapdGroupKey) {
          throw new GraphQLError(
            'Either tapdAssetId or tapdGroupKey must be provided'
          );
        }
      },

      nodeInfo: async (): Promise<SetupTradeCapacityAuto['nodeInfo']> => {
        const [info, error] = await toWithError(
          this.nodeService.getWalletInfo(user.id)
        );
        if (error || !info) {
          this.logger.error('Failed to get node wallet info', { error });
          throw new GraphQLError('Error getting node information');
        }
        return { publicKey: info.public_key };
      },

      peer: [
        'validate',
        async (): Promise<SetupTradeCapacityAuto['peer']> => {
          let sockets = input.swapNodeSockets || [];

          if (!sockets.length) {
            const nodeInfo = await this.nodeService.getNode(
              user.id,
              input.swapNodePubkey,
              true
            );
            sockets = (nodeInfo.sockets ?? []).map(
              (s: { socket: string }) => s.socket
            );
          }

          if (!sockets.length) {
            this.logger.debug('No sockets found for swap node');
            return;
          }

          for (const socket of sockets) {
            const [, err] = await toWithError(
              this.nodeService.addPeer(
                user.id,
                input.swapNodePubkey,
                socket,
                false
              )
            );
            if (!err) return;
          }

          this.logger.warn('All peer connection attempts failed — continuing', {
            pubkey: input.swapNodePubkey,
            attemptedSockets: sockets,
          });
        },
      ],

      // Query existing channel state with the peer to decide what to skip.
      channelState: [
        'validate',
        async (): Promise<SetupTradeCapacityAuto['channelState']> => {
          const [channelsResult, pendingResult, assetBalancesResult] =
            await Promise.all([
              toWithError(
                this.nodeService.getChannels(user.id, {
                  partner_public_key: input.swapNodePubkey,
                })
              ),
              toWithError(this.nodeService.getPendingChannels(user.id)),
              input.tapdAssetId || input.tapdGroupKey
                ? toWithError(
                    this.tapdNodeService.getAssetChannelBalances({
                      id: user.id,
                      peerPubkey: input.swapNodePubkey,
                    })
                  )
                : Promise.resolve([[], undefined] as const),
            ]);

          const peerChannels = channelsResult[0]?.channels || [];
          const pendingChannels = pendingResult[0]?.pending_channels || [];
          const assetBalances = (assetBalancesResult[0] || []) as Array<{
            assetId: string;
            groupKey?: string;
            localBalance?: string;
            remoteBalance?: string;
          }>;

          const btcOpen = peerChannels.filter(
            (ch: { type?: string }) => !!ch.type
          );
          const peerPending = pendingChannels.filter(
            (ch: { partner_public_key: string; is_opening: boolean }) =>
              ch.partner_public_key === input.swapNodePubkey && ch.is_opening
          );
          const btcPending = peerPending.filter(
            (ch: { asset?: unknown }) => !ch.asset
          );

          const matchingAssets = assetBalances.filter(ab =>
            input.tapdGroupKey
              ? ab.groupKey === input.tapdGroupKey
              : ab.assetId === input.tapdAssetId
          );
          const assetPending = peerPending.filter(
            (ch: { asset?: { asset_id: string; group_key?: string } }) => {
              if (!ch.asset) return false;
              return input.tapdGroupKey
                ? ch.asset.group_key === input.tapdGroupKey
                : ch.asset.asset_id === input.tapdAssetId;
            }
          );

          return {
            btcLocalSats: btcOpen.reduce(
              (s: number, ch: { local_balance?: number }) =>
                s + (ch.local_balance || 0),
              0
            ),
            btcRemoteSats: btcOpen.reduce(
              (s: number, ch: { remote_balance?: number }) =>
                s + (ch.remote_balance || 0),
              0
            ),
            btcPendingCount: btcPending.length,
            assetRemoteAtomic: matchingAssets.reduce(
              (s, ch) => s + BigInt(ch.remoteBalance || '0'),
              BigInt(0)
            ),
            assetPendingCount: assetPending.length,
          };
        },
      ],

      magmaOrder: [
        'nodeInfo',
        'peer',
        'channelState',
        async ({
          nodeInfo,
          channelState,
        }: Pick<SetupTradeCapacityAuto, 'nodeInfo' | 'channelState'>): Promise<
          SetupTradeCapacityAuto['magmaOrder']
        > => {
          const isAssetPurchase =
            input.transactionType === TapTransactionType.PURCHASE;

          // For PURCHASE: inbound = asset channels. Skip if remote asset
          // capacity already covers the requested amount.
          if (isAssetPurchase) {
            const needed = BigInt(input.assetAmount);
            if (
              channelState.assetRemoteAtomic >= needed ||
              channelState.assetPendingCount > 0
            ) {
              this.logger.info(
                'Skipping Magma order — inbound asset capacity sufficient or pending',
                {
                  needed: needed.toString(),
                  existing: channelState.assetRemoteAtomic.toString(),
                  pending: channelState.assetPendingCount,
                }
              );
              return undefined;
            }
          }

          const magmaUrl = await this.ambossService.resolveMagmaUrl(user);

          // Order the deficit: requested minus existing inbound.
          const deficit = isAssetPurchase
            ? (
                BigInt(input.assetAmount) - channelState.assetRemoteAtomic
              ).toString()
            : input.assetAmount;

          const magmaSize = computeMagmaOrderSize(
            input.transactionType,
            deficit,
            input.assetRate
          );

          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              market: {
                order: {
                  create: {
                    id: string;
                    status: string;
                    size: string;
                    payment?: {
                      lightning?: { invoice?: string; pending?: boolean };
                    };
                    fees?: {
                      buyer?: { sats?: number };
                    };
                  };
                };
              };
            }>(
              magmaUrl,
              createMagmaOrderMutation,
              {
                input: {
                  offer_id: input.magmaOfferId,
                  pubkey: nodeInfo.publicKey,
                  size: magmaSize,
                  payment_method: 'SATS',
                  options: {
                    asset_id: input.ambossAssetId,
                    private: true,
                  },
                },
              },
              { authorization: `Bearer ${ambossAuth}` }
            );

          const order = data?.market?.order?.create;
          const invoice = order?.payment?.lightning?.invoice;

          if (error || !order || !invoice) {
            this.logger.error('Magma order creation failed', {
              error,
              orderId: order?.id,
              hasInvoice: !!invoice,
            });
            const detail = typeof error === 'string' ? error : undefined;
            throw new GraphQLError(
              detail
                ? `Failed to create Magma channel order: ${detail}`
                : 'Failed to create Magma channel order'
            );
          }

          this.logger.info('Magma order created', {
            orderId: order.id,
            status: order.status,
            size: order.size,
            feeSats: order.fees?.buyer?.sats,
          });

          const isAssetAmount =
            input.transactionType === TapTransactionType.PURCHASE;

          return {
            id: order.id,
            status: order.status,
            invoice,
            amountSats: isAssetAmount ? undefined : order.size,
            amountAsset: isAssetAmount ? order.size : undefined,
            feeSats: order.fees?.buyer?.sats,
          };
        },
      ],

      payMagma: [
        'magmaOrder',
        async ({
          magmaOrder,
        }: Pick<SetupTradeCapacityAuto, 'magmaOrder'>): Promise<
          SetupTradeCapacityAuto['payMagma']
        > => {
          // Skip if no Magma order was created (inbound already sufficient).
          if (!magmaOrder) return;

          this.logger.info('Paying Magma invoice', {
            orderId: magmaOrder.id,
          });

          // Magma uses a HODL invoice: payment stays in-flight until the
          // inbound channel is confirmed on-chain. Waiting for pay() to
          // resolve would block for ~10 minutes.
          //
          // Instead we race two signals:
          //   1. channel_opening from the trade peer → return early (fast)
          //   2. pay() immediate failure → surface the error (fast)
          //
          // If pay() fails immediately, the payment race leg rejects and we
          // surface the error. Otherwise the channel-opening leg wins.

          const payPromise = this.nodeService.pay(user.id, {
            request: magmaOrder.invoice,
          });

          // Only rejects on immediate payment failure; never resolves
          // (payment confirmation happens long after we've returned).
          const payFailureGuard = new Promise<never>((_, reject) => {
            payPromise.catch(err => {
              this.logger.error('Failed to pay Magma invoice', { err });
              reject(new GraphQLError('Failed to pay Magma invoice'));
            });
          });

          await Promise.race([
            this.nodeService.waitForChannelFromPeer(
              user.id,
              input.swapNodePubkey,
              120_000
            ),
            payFailureGuard,
          ]);

          // Suppress the now-detached payFailureGuard rejection and log the
          // eventual settlement outcome for observability.
          payFailureGuard.catch(() => {});
          payPromise
            .then(() => {
              this.logger.info('Magma HODL invoice settled', {
                orderId: magmaOrder.id,
              });
            })
            .catch(err => {
              this.logger.error(
                'Magma HODL invoice failed after channel detection',
                { orderId: magmaOrder.id, err }
              );
            });

          this.logger.info('Magma channel opening detected', {
            orderId: magmaOrder.id,
          });
        },
      ],

      // Runs in parallel with payMagma — no dependency on inbound channel.
      outboundChannel: [
        'peer',
        'channelState',
        async ({
          channelState,
        }: Pick<SetupTradeCapacityAuto, 'channelState'>): Promise<
          SetupTradeCapacityAuto['outboundChannel']
        > => {
          if (input.transactionType === TapTransactionType.PURCHASE) {
            // Skip if existing BTC outbound covers the needed sats or a
            // pending BTC channel is already opening.
            if (!input.satsAmount) {
              return undefined;
            }

            const neededSats = Number(input.satsAmount);
            if (
              channelState.btcLocalSats >= neededSats ||
              channelState.btcPendingCount > 0
            ) {
              this.logger.info(
                'Skipping outbound BTC channel — sufficient capacity or pending',
                {
                  needed: neededSats,
                  existing: channelState.btcLocalSats,
                  pending: channelState.btcPendingCount,
                }
              );
              return undefined;
            }

            const [channelResult, error] = await toWithError(
              this.nodeService.openChannel(user.id, {
                local_tokens: neededSats,
                partner_public_key: input.swapNodePubkey,
              })
            );

            if (error || !channelResult) {
              this.logger.error('Failed to open outbound BTC channel', {
                error,
              });
              throw new GraphQLError('Failed to open outbound channel');
            }

            return {
              txid: channelResult.transaction_id,
              outputIndex: Number(channelResult.transaction_vout),
            };
          }

          // No openAssetChannel flag → outbound asset channel already exists, skip.
          if (!input.openAssetChannel) {
            return undefined;
          }

          const [channelResult, error] = await toWithError(
            this.tapdNodeService.fundAssetChannel({
              id: user.id,
              peerPubkey: input.swapNodePubkey,
              assetAmount: input.assetAmount,
              ...(input.tapdGroupKey
                ? { groupKey: input.tapdGroupKey }
                : { assetId: input.tapdAssetId }),
            })
          );

          if (error || !channelResult) {
            this.logger.error('Failed to open outbound asset channel', {
              error,
            });
            throw new GraphQLError('Failed to open outbound asset channel');
          }

          return {
            txid: channelResult.txid,
            outputIndex: channelResult.outputIndex,
          };
        },
      ],
    });

    return {
      success: true,
      magmaOrderId: result.magmaOrder?.id,
      magmaOrderStatus: result.magmaOrder?.status,
      magmaOrderAmountSats: result.magmaOrder?.amountSats,
      magmaOrderAmountAsset: result.magmaOrder?.amountAsset,
      magmaOrderFeeSats:
        result.magmaOrder?.feeSats != null
          ? String(result.magmaOrder.feeSats)
          : undefined,
      outboundChannelTxid: result.outboundChannel?.txid,
      outboundChannelOutputIndex: result.outboundChannel?.outputIndex,
      skippedMagmaOrder: !result.magmaOrder || undefined,
      skippedOutboundChannel:
        (!!input.satsAmount && !result.outboundChannel) || undefined,
    };
  }
}

// ── Magma Query Namespace ──

@Resolver()
export class MagmaQueryRoot {
  @Query(() => MagmaQueries)
  magma(): MagmaQueries {
    return {} as any;
  }
}

@Resolver(() => MagmaQueries)
export class MagmaQueriesResolver {
  constructor(
    private fetchService: FetchService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => String)
  id(): string {
    return uuidv5(MagmaQueriesResolver.name, uuidv5.URL);
  }

  @ResolveField(() => MagmaOrderQueries)
  orders(): MagmaOrderQueries {
    return {} as any;
  }

  @ResolveField(() => TapTradeOfferList)
  async get_tap_offers(
    @CurrentUser() user: UserId,
    @Args('input') input: GetTapOffersInput
  ) {
    const tradeUrl = await this.ambossService.resolveTradeUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        offers: {
          list: TradeApiOffer[];
          total_count: number;
        };
      };
    }>(tradeUrl, getOffersQuery, {
      input: {
        ...(input.ambossAssetId ? { asset_id: input.ambossAssetId } : {}),
        transaction_type: input.transactionType,
        ...(input.sortBy ? { sort_by: input.sortBy } : {}),
        ...(input.sortDir ? { sort_dir: input.sortDir } : {}),
        ...(input.minAmount ? { min_amount: input.minAmount } : {}),
        ...(input.limit || input.offset
          ? {
              page: {
                limit: input.limit || 20,
                offset: input.offset || 0,
              },
            }
          : {}),
      },
    });

    if (error || !data?.public?.offers) {
      if (error) {
        this.logger.error('Error fetching trade offers', { error });
      } else {
        this.logger.warn(
          'Trade API returned unexpected data shape for offers',
          { data }
        );
      }
      return { list: [], totalCount: 0 };
    }

    const offers = data.public.offers;

    return {
      list: offers.list.map(o => ({
        id: o.id,
        magmaOfferId: o.magma_offer_id,
        node: {
          alias: o.node?.alias,
          pubkey: o.node?.pubkey,
          sockets: o.node?.sockets || [],
        },
        rate: {
          displayAmount: o.rate?.display_amount,
          fullAmount: o.rate?.full_amount,
        },
        available: {
          displayAmount: o.available?.display_amount,
          fullAmount: o.available?.full_amount,
        },
        minOrder: {
          displayAmount: o.min_order?.display_amount || '0',
          fullAmount: o.min_order?.full_amount || '0',
        },
        maxOrder: {
          displayAmount: o.max_order?.display_amount || '0',
          fullAmount: o.max_order?.full_amount || '0',
        },
        fees: {
          baseFeeSats: o.fees?.base_fee_sats ?? 0,
          feeRatePpm: o.fees?.fee_rate_ppm ?? 0,
        },
        asset: {
          id: o.asset?.id || '',
          symbol: o.asset?.symbol || '',
          precision: o.asset?.precision ?? 0,
          assetId: o.asset?.taproot_asset_details?.asset_id,
          groupKey: o.asset?.taproot_asset_details?.group_key,
        },
      })),
      totalCount: offers.total_count,
    };
  }
}

// ── Rails (RailsX Trade) Query Namespace ──

@Resolver()
export class RailsQueryRoot {
  @Query(() => RailsQueries)
  rails(): RailsQueries {
    return {} as any;
  }
}

const isBtcChannel = (ch: { type?: string }) => !!ch.type;

@Resolver(() => RailsQueries)
export class RailsQueriesResolver {
  constructor(
    private nodeService: NodeService,
    private tapdNodeService: TapdNodeService,
    private fetchService: FetchService,
    private tapFederationService: TapFederationService,
    private ambossService: AmbossService,
    private ambossTokenService: AmbossTokenService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => String)
  id(): string {
    return uuidv5(RailsQueriesResolver.name, uuidv5.URL);
  }

  @ResolveField(() => TapSupportedAssetList)
  async get_tap_supported_assets(@CurrentUser() user: UserId) {
    const tradeUrl = await this.ambossService.resolveTradeUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        assets: {
          supported: {
            list: TradeApiSupportedAsset[];
            total_count: number;
          };
        };
      };
    }>(tradeUrl, getSupportedAssetsQuery);

    if (error || !data?.public?.assets?.supported) {
      if (error) {
        this.logger.error('Error fetching supported assets', { error });
      } else {
        this.logger.warn(
          'Trade API returned unexpected data shape for supported assets',
          { data }
        );
      }
      return { list: [], totalCount: 0 };
    }

    const assets = data.public.assets.supported;

    const universeHosts = [
      ...new Set(
        assets.list
          .map(a => a.taproot_asset_details?.universe)
          .filter((h): h is string => !!h)
      ),
    ];

    if (universeHosts.length) {
      this.tapFederationService
        .syncForAccount(user.id, universeHosts)
        .catch(err => {
          this.logger.warn('Federation sync failed', { error: err });
        });
    }

    return {
      list: assets.list.map(a => ({
        id: a.id,
        symbol: a.symbol || '',
        description: a.description,
        precision: a.precision ?? 0,
        assetId: a.taproot_asset_details?.asset_id,
        groupKey: a.taproot_asset_details?.group_key,
        universeHost: a.taproot_asset_details?.universe,
        prices: a.prices ?? null,
      })),
      totalCount: assets.total_count,
    };
  }

  @ResolveField(() => TradeReadinessResult)
  async trade_readiness(
    @CurrentUser() user: UserId
  ): Promise<TradeReadinessResult> {
    try {
      return await this.getTradeReadiness(user);
    } catch (err) {
      this.logger.error('trade_readiness failed', { err });
      return {
        node_online: false,
        has_tapd: false,
        onchain_balance_sats: '0',
        pending_onchain_balance_sats: '0',
        has_channel: false,
        has_active_channel: false,
      };
    }
  }

  @ResolveField(() => OfferReadinessResult)
  async offer_readiness(
    @CurrentUser() user: UserId,
    @Args('input') input: OfferReadinessInput
  ): Promise<OfferReadinessResult> {
    try {
      return await this.getOfferReadiness(user, input);
    } catch (err) {
      this.logger.error('offer_readiness failed', { err });
      return {
        is_peer_connected: false,
        btc_channels: {
          open_count: 0,
          pending_count: 0,
          total_local_sats: '0',
          total_remote_sats: '0',
          has_active_channel: false,
        },
        asset_channels: {
          open_count: 0,
          pending_count: 0,
          total_local_atomic: '0',
          total_remote_atomic: '0',
          has_active_channel: false,
        },
        has_pending_order: false,
        onchain_balance_sats: '0',
        onchain_asset_balance: '0',
      };
    }
  }

  private async getTradeReadiness(user: UserId): Promise<TradeReadinessResult> {
    const { id } = user;

    type ReadinessAuto = {
      walletInfo: { public_key: string; alias?: string } | null;
      chainBalance: number;
      pendingChainBalance: number;
      tapdInfo: boolean;
      allChannels: Array<{ type?: string; is_active: boolean }>;
      pendingChannels: Array<{
        partner_public_key: string;
        is_opening: boolean;
      }>;
      hasChannel: boolean;
      hasActiveChannel: boolean;
      depositAddress: string | undefined;
      recommendedNode: RecommendedNode | undefined;
    };

    const result = await auto<ReadinessAuto>({
      walletInfo: async () => {
        const [info, err] = await toWithError(
          this.nodeService.getWalletInfo(id)
        );
        return err ? null : info;
      },

      chainBalance: async () => {
        const [bal] = await toWithError(this.nodeService.getChainBalance(id));
        return bal?.chain_balance ?? 0;
      },

      pendingChainBalance: async () => {
        const [bal] = await toWithError(
          this.nodeService.getPendingChainBalance(id)
        );
        return bal?.pending_chain_balance ?? 0;
      },

      tapdInfo: async () => {
        const [, err] = await toWithError(this.tapdNodeService.getInfo({ id }));
        return !err;
      },

      allChannels: async () => {
        const [result] = await toWithError(this.nodeService.getChannels(id));
        return result?.channels || [];
      },

      pendingChannels: async () => {
        const [r] = await toWithError(this.nodeService.getPendingChannels(id));
        return r?.pending_channels || [];
      },

      hasChannel: [
        'allChannels',
        'pendingChannels',
        async ({
          allChannels,
          pendingChannels,
        }: Pick<ReadinessAuto, 'allChannels' | 'pendingChannels'>) => {
          return (
            allChannels.length > 0 ||
            pendingChannels.filter(ch => ch.is_opening).length > 0
          );
        },
      ],

      hasActiveChannel: [
        'allChannels',
        async ({ allChannels }: Pick<ReadinessAuto, 'allChannels'>) => {
          return allChannels.some(ch => ch.is_active);
        },
      ],

      depositAddress: [
        'chainBalance',
        'pendingChainBalance',
        'tapdInfo',
        async ({
          chainBalance,
          pendingChainBalance,
          tapdInfo,
        }: Pick<
          ReadinessAuto,
          'chainBalance' | 'pendingChainBalance' | 'tapdInfo'
        >) => {
          if (!tapdInfo) return undefined;
          if (chainBalance > 0 || pendingChainBalance > 0) return undefined;
          const [addr, err] = await toWithError(
            this.nodeService.createChainAddress(id, true, 'p2tr')
          );
          if (err) {
            this.logger.warn('Failed to create deposit address', { err });
            return undefined;
          }
          return addr?.address || undefined;
        },
      ],

      recommendedNode: [
        'hasChannel',
        async ({ hasChannel }: Pick<ReadinessAuto, 'hasChannel'>) => {
          if (hasChannel) return undefined;
          const [spaceUrl, spaceUrlErr] = await toWithError(
            this.ambossService.resolveSpaceUrl(user)
          );
          if (spaceUrlErr || !spaceUrl) return undefined;
          const [recData] = await toWithError(
            this.fetchService.graphqlFetchWithProxy<{
              rails: {
                get_recommended_node: {
                  id: string;
                  pubkey: string;
                  sockets: string[];
                };
              };
            }>(spaceUrl, GetRecommendedNode)
          );
          const node = recData?.data?.rails?.get_recommended_node;
          if (node?.pubkey && node.sockets?.length) {
            return { pubkey: node.pubkey, sockets: node.sockets };
          }
          return undefined;
        },
      ],
    });

    if (!result.walletInfo) {
      return {
        node_online: false,
        has_tapd: false,
        onchain_balance_sats: '0',
        pending_onchain_balance_sats: '0',
        has_channel: false,
        has_active_channel: false,
      };
    }

    return {
      node_online: true,
      public_key: result.walletInfo.public_key,
      alias: result.walletInfo.alias,
      has_tapd: result.tapdInfo,
      onchain_balance_sats: String(result.chainBalance),
      pending_onchain_balance_sats: String(result.pendingChainBalance),
      deposit_address: result.depositAddress,
      has_channel: result.hasChannel,
      has_active_channel: result.hasActiveChannel,
      recommended_node: result.recommendedNode,
    };
  }

  private async getOfferReadiness(
    user: UserId,
    input: OfferReadinessInput
  ): Promise<OfferReadinessResult> {
    const { id } = user;

    const [
      peersResult,
      peerChannelsResult,
      pendingResult,
      assetBalancesResult,
      ordersResult,
      chainBalanceResult,
      onchainAssetResult,
    ] = await Promise.all([
      toWithError(this.nodeService.getPeers(id)),
      toWithError(
        this.nodeService.getChannels(id, {
          partner_public_key: input.peer_pubkey,
        })
      ),
      toWithError(this.nodeService.getPendingChannels(id)),
      input.tapd_asset_id || input.tapd_group_key
        ? toWithError(
            this.tapdNodeService.getAssetChannelBalances({
              id,
              peerPubkey: input.peer_pubkey,
            })
          )
        : Promise.resolve([[], undefined] as const),
      this.fetchPendingOrdersForPeer(user, input.peer_pubkey),
      toWithError(this.nodeService.getChainBalance(id)),
      toWithError(
        this.tapdNodeService.listBalances({
          id,
          groupBy: input.tapd_group_key ? 'groupKey' : 'assetId',
        })
      ),
    ]);

    const peers = peersResult[0]?.peers || [];
    const peerChannels = peerChannelsResult[0]?.channels || [];
    const pendingChannels = pendingResult[0]?.pending_channels || [];
    const assetBalances = assetBalancesResult[0] || [];
    const hasPendingOrder = ordersResult;
    const chainBalance = chainBalanceResult[0]?.chain_balance ?? 0;

    // On-chain asset balance for the specific asset
    let onchainAssetBalance = BigInt(0);
    const balancesData = onchainAssetResult[0];
    if (balancesData) {
      if (input.tapd_group_key) {
        const entry = (
          balancesData.assetGroupBalances as Record<
            string,
            { balance: bigint | string }
          >
        )?.[input.tapd_group_key];
        if (entry) onchainAssetBalance = BigInt(entry.balance);
      } else if (input.tapd_asset_id) {
        const entry = (
          balancesData.assetBalances as Record<
            string,
            { balance: bigint | string }
          >
        )?.[input.tapd_asset_id];
        if (entry) onchainAssetBalance = BigInt(entry.balance);
      }
    }

    // BTC channels
    const peerPending = pendingChannels.filter(
      (ch: { partner_public_key: string; is_opening: boolean }) =>
        ch.partner_public_key === input.peer_pubkey && ch.is_opening
    );
    const btcOpen = peerChannels.filter(isBtcChannel);
    const btcPending = peerPending.filter(
      (ch: { asset?: unknown }) => !ch.asset
    );

    // Asset channels
    const matchingAssets = (
      assetBalances as Array<{
        assetId: string;
        groupKey?: string;
        localBalance?: string;
        remoteBalance?: string;
      }>
    ).filter(ab =>
      input.tapd_group_key
        ? ab.groupKey === input.tapd_group_key
        : ab.assetId === input.tapd_asset_id
    );
    const assetPending = peerPending.filter(
      (ch: { asset?: { asset_id: string; group_key?: string } }) => {
        if (!ch.asset) return false;
        return input.tapd_group_key
          ? ch.asset.group_key === input.tapd_group_key
          : ch.asset.asset_id === input.tapd_asset_id;
      }
    );

    return {
      is_peer_connected: peers.some(
        (p: { public_key: string }) => p.public_key === input.peer_pubkey
      ),
      btc_channels: {
        open_count: btcOpen.length,
        pending_count: btcPending.length,
        total_local_sats: String(
          btcOpen.reduce(
            (s: number, ch: { local_balance?: number }) =>
              s + (ch.local_balance || 0),
            0
          )
        ),
        total_remote_sats: String(
          btcOpen.reduce(
            (s: number, ch: { remote_balance?: number }) =>
              s + (ch.remote_balance || 0),
            0
          )
        ),
        has_active_channel: btcOpen.some(
          (ch: { is_active?: boolean }) => ch.is_active
        ),
      },
      asset_channels: {
        open_count: matchingAssets.length,
        pending_count: assetPending.length,
        total_local_atomic: matchingAssets
          .reduce((s, ch) => s + BigInt(ch.localBalance || '0'), BigInt(0))
          .toString(),
        total_remote_atomic: matchingAssets
          .reduce((s, ch) => s + BigInt(ch.remoteBalance || '0'), BigInt(0))
          .toString(),
        has_active_channel: matchingAssets.length > 0,
      },
      has_pending_order: hasPendingOrder,
      onchain_balance_sats: String(chainBalance),
      onchain_asset_balance: onchainAssetBalance.toString(),
    };
  }

  private async fetchPendingOrdersForPeer(
    user: UserId,
    peerPubkey: string
  ): Promise<boolean> {
    try {
      const [ambossAuth, magmaUrl] = await Promise.all([
        this.ambossTokenService.getOrCreate(user),
        this.ambossService.resolveMagmaUrl(user),
      ]);

      const pendingStatuses = [
        'WAITING_FOR_CHANNEL_OPEN',
        'WAITING_FOR_SELLER_APPROVAL',
        'WAITING_FOR_PAYMENT',
        'CHANNEL_OPENING',
      ];

      const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
        user: {
          market: {
            orders: {
              purchases: AmbossOrderList;
              sales: AmbossOrderList;
            };
          };
        };
      }>(
        magmaUrl,
        getOrdersQuery,
        {
          page: { offset: 0, limit: 1 },
          input: {
            peer_pubkey: peerPubkey,
            status: pendingStatuses,
          },
        },
        { authorization: `Bearer ${ambossAuth}` }
      );

      if (error || !data?.user?.market?.orders) return false;

      const { purchases, sales } = data.user.market.orders;
      return purchases.total > 0 || sales.total > 0;
    } catch {
      return false;
    }
  }
}

@Resolver(() => MagmaOrderQueries)
export class MagmaOrderQueriesResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private ambossTokenService: AmbossTokenService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => MagmaPendingOrders, { nullable: true })
  async find_many(
    @CurrentUser() user: UserId
  ): Promise<MagmaPendingOrders | null> {
    const ambossAuth = await this.ambossTokenService.getOrCreate(user);
    const magmaUrl = await this.ambossService.resolveMagmaUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      user: {
        market: {
          orders: {
            purchases: AmbossOrderList;
            sales: AmbossOrderList;
          };
        };
      };
    }>(
      magmaUrl,
      getOrdersQuery,
      { page: { offset: 0, limit: 999 } },
      { authorization: `Bearer ${ambossAuth}` }
    );

    if (error || !data?.user?.market?.orders) {
      if (error) this.logger.error('Error fetching Magma orders', { error });
      return null;
    }

    const mapOrder = (o: AmbossOrderRaw): MagmaOrder => ({
      id: o.id,
      createdAt: o.created_at,
      status: o.status,
      paymentStatus: o.payment_status,
      source: { pubkey: o.source?.pubkey, alias: o.source?.alias },
      destination: {
        pubkey: o.destination?.pubkey,
        alias: o.destination?.alias,
      },
      amount: { sats: o.amount?.satoshi?.sats },
      fees: {
        seller: o.fees?.seller ? { sats: o.fees.seller.sats } : undefined,
        buyer: o.fees?.buyer ? { sats: o.fees.buyer.sats } : undefined,
      },
      timeout: o.timeout,
      channelId: o.channel_id,
    });

    const { purchases, sales } = data.user.market.orders;

    const [info] = await toWithError(this.nodeService.getWalletInfo(user.id));
    const pubkey = info?.public_key;

    const allPurchases = purchases.list.map(mapOrder);
    const allSales = sales.list.map(mapOrder);

    return {
      purchases: pubkey
        ? allPurchases.filter(o => o.destination?.pubkey === pubkey)
        : allPurchases,
      sales: pubkey
        ? allSales.filter(o => o.source?.pubkey === pubkey)
        : allSales,
      magmaUrl: magmaUrl.replace('/graphql', ''),
    };
  }

  @ResolveField(() => MagmaOrderInvoice)
  async get_invoice(
    @CurrentUser() user: UserId,
    @Args('orderId') orderId: string
  ): Promise<MagmaOrderInvoice> {
    const ambossAuth = await this.ambossTokenService.getOrCreate(user);
    const magmaUrl = await this.ambossService.resolveMagmaUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      user: {
        market: {
          orders: {
            get_order: {
              id: string;
              payment?: {
                lightning?: { invoice?: string };
              };
            };
          };
        };
      };
    }>(
      magmaUrl,
      getOrderPaymentQuery,
      { orderId },
      { authorization: `Bearer ${ambossAuth}` }
    );

    if (error || !data?.user?.market?.orders?.get_order) {
      if (error)
        this.logger.error('Error fetching Magma order invoice', { error });
      return {};
    }

    return {
      invoice: data.user.market.orders.get_order.payment?.lightning?.invoice,
    };
  }
}

// ── Magma Mutation Namespace ──

@Resolver()
export class MagmaMutationRoot {
  @Mutation(() => MagmaMutations)
  magma(): MagmaMutations {
    return {} as any;
  }
}

@Resolver(() => MagmaMutations)
export class MagmaMutationsResolver {
  constructor(
    private fetchService: FetchService,
    private ambossTokenService: AmbossTokenService,
    private ambossService: AmbossService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => CancelMagmaOrderResult)
  async cancel_order(
    @CurrentUser() user: UserId,
    @Args('input') input: CancelMagmaOrderInput
  ): Promise<CancelMagmaOrderResult> {
    const ambossAuth = await this.ambossTokenService.getOrCreate(user);
    const magmaUrl = await this.ambossService.resolveMagmaUrl(user);

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      market: { order: { cancel: { success: boolean } } };
    }>(
      magmaUrl,
      cancelMagmaOrderMutation,
      {
        input: {
          order_id: input.orderId,
          cancellation_reason: input.cancellationReason,
        },
      },
      { authorization: `Bearer ${ambossAuth}` }
    );

    if (error || !data?.market?.order?.cancel) {
      this.logger.error('Error cancelling Magma order', { error });
      throw new GraphQLError(
        typeof error === 'string'
          ? `Failed to cancel order: ${error}`
          : 'Failed to cancel order'
      );
    }

    return { success: data.market.order.cancel.success };
  }
}
