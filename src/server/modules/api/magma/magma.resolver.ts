import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import { auto } from 'async';
import { ContextType } from '../../../app.module';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { NodeService } from '../../node/node.service';
import { FetchService } from '../../fetch/fetch.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from '../../../utils/async';
import { TapFederationService } from '../tapd/tapd-federation.service';
import {
  GetTapOffersInput,
  TapTradeOfferList,
  TapSupportedAssetList,
  TapTransactionType,
  SetupTradePartnerInput,
  SetupTradePartnerResult,
  SetupTradePartnerAuto,
} from './magma.types';
import {
  getOffersQuery,
  getSupportedAssetsQuery,
  createMagmaOrderMutation,
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
    private configService: ConfigService,
    private tapFederationService: TapFederationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // ── Trading Offers ──

  @Query(() => TapTradeOfferList)
  async getTapOffers(
    @CurrentUser() _user: UserId,
    @Args('input') input: GetTapOffersInput
  ) {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) {
      return { list: [], totalCount: 0 };
    }

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        offers: {
          list: TradeApiOffer[];
          total_count: number;
        };
      };
    }>(tradeUrl, getOffersQuery, {
      input: {
        asset_id: input.ambossAssetId,
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
      if (error) this.logger.error('Error fetching trade offers', { error });
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
      })),
      totalCount: offers.total_count,
    };
  }

  @Query(() => TapSupportedAssetList)
  async getTapSupportedAssets(
    @CurrentUser() _user: UserId,
    @Context() { ambossAuth }: ContextType
  ) {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) {
      return { list: [], totalCount: 0 };
    }

    const headers = ambossAuth ? { authorization: `Bearer ${ambossAuth}` } : {};

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        assets: {
          supported: {
            list: TradeApiSupportedAsset[];
            total_count: number;
          };
        };
      };
    }>(tradeUrl, getSupportedAssetsQuery, undefined, headers);

    if (error || !data?.public?.assets?.supported) {
      if (error)
        this.logger.error('Error fetching supported assets', { error });
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
        .syncForAccount(_user.id, universeHosts)
        .catch(() => {});
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

  // ── Trade Partner Setup ──

  @Mutation(() => SetupTradePartnerResult)
  async setupTradePartner(
    @CurrentUser() user: UserId,
    @Context() { ambossAuth }: ContextType,
    @Args('input') input: SetupTradePartnerInput
  ): Promise<SetupTradePartnerResult> {
    const result = await auto<SetupTradePartnerAuto>({
      validate: async (): Promise<SetupTradePartnerAuto['validate']> => {
        if (input.transactionType == TapTransactionType.SALE) {
          throw new GraphQLError(`Selling not implemented yet`);
        }
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

      nodeInfo: async (): Promise<SetupTradePartnerAuto['nodeInfo']> => {
        const [info, error] = await toWithError(
          this.nodeService.getWalletInfo(user.id)
        );
        if (error || !info) {
          if (error) this.logger.error(error);
          throw new GraphQLError('Error getting node information');
        }
        return { publicKey: info.public_key };
      },

      peer: [
        'validate',
        async (): Promise<SetupTradePartnerAuto['peer']> => {
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

          this.logger.debug('Peer connection attempts failed — continuing', {
            pubkey: input.swapNodePubkey,
          });
        },
      ],

      magmaOrder: [
        'nodeInfo',
        'peer',
        async ({
          nodeInfo,
        }: Pick<SetupTradePartnerAuto, 'nodeInfo'>): Promise<
          SetupTradePartnerAuto['magmaOrder']
        > => {
          const magmaUrl = this.configService.get<string>('urls.amboss.magma');

          const magmaSize = computeMagmaOrderSize(
            input.transactionType,
            input.assetAmount,
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
                  options: { asset_id: input.ambossAssetId },
                },
              },
              { authorization: `Bearer ${ambossAuth}` }
            );

          const order = data?.market?.order?.create;
          const invoice = order?.payment?.lightning?.invoice;

          if (error || !order || !invoice) {
            if (error)
              this.logger.error('Magma order creation failed', { error });
            throw new GraphQLError('Failed to create Magma channel order');
          }

          this.logger.info('Magma order created', {
            orderId: order.id,
            status: order.status,
            size: order.size,
            feeSats: order.fees?.buyer?.sats,
          });

          return {
            id: order.id,
            status: order.status,
            invoice,
            amountAsset: order.size,
            feeSats: order.fees?.buyer?.sats,
          };
        },
      ],

      payMagma: [
        'magmaOrder',
        async ({
          magmaOrder,
        }: Pick<SetupTradePartnerAuto, 'magmaOrder'>): Promise<
          SetupTradePartnerAuto['payMagma']
        > => {
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

          // Only rejects on immediate payment failure; never resolves
          // (payment confirmation happens long after we've returned).
          const payFailureGuard = new Promise<never>((_, reject) => {
            this.nodeService
              .pay(user.id, { request: magmaOrder.invoice })
              .catch(err => {
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

          this.logger.info('Magma channel opening detected', {
            orderId: magmaOrder.id,
          });
        },
      ],

      outboundChannel: [
        'peer',
        'payMagma',
        async (): Promise<SetupTradePartnerAuto['outboundChannel']> => {
          if (input.transactionType === TapTransactionType.PURCHASE) {
            // No sats provided → outbound BTC channel already exists, skip.
            if (!input.satsAmount) {
              return undefined;
            }

            const [channelResult, error] = await toWithError(
              this.nodeService.openChannel(user.id, {
                local_tokens: Number(input.satsAmount),
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

          const [channelResult, error] = await toWithError(
            this.tapdNodeService.fundAssetChannel({
              id: user.id,
              peerPubkey: input.swapNodePubkey,
              assetAmount: Number(input.assetAmount),
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
      magmaOrderId: result.magmaOrder.id,
      magmaOrderStatus: result.magmaOrder.status,
      magmaOrderAmountSats: result.magmaOrder.amountSats,
      magmaOrderAmountAsset: result.magmaOrder.amountAsset,
      magmaOrderFeeSats:
        result.magmaOrder.feeSats != null
          ? String(result.magmaOrder.feeSats)
          : undefined,
      outboundChannelTxid: result.outboundChannel?.txid,
      outboundChannelOutputIndex: result.outboundChannel?.outputIndex,
    };
  }
}
