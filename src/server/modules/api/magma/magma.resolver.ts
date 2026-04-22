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
import {
  GetTapOffersInput,
  TapTradeOfferList,
  TapSupportedAssetList,
  TapTransactionType,
  SetupTradePartnerInput,
  SetupTradePartnerResult,
  SetupTradePartnerAuto,
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

  // ── Trade Partner Setup ──

  @Mutation(() => SetupTradePartnerResult)
  async setupTradePartner(
    @CurrentUser() user: UserId,
    @Args('input') input: SetupTradePartnerInput
  ): Promise<SetupTradePartnerResult> {
    const ambossAuth = await this.ambossTokenService.getOrCreate(user);
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
          this.logger.error('Failed to get node wallet info', { error });
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

          this.logger.warn('All peer connection attempts failed — continuing', {
            pubkey: input.swapNodePubkey,
            attemptedSockets: sockets,
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
          const magmaUrl = await this.ambossService.resolveMagmaUrl(user);

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
                  is_private: true,
                  options: { asset_id: input.ambossAssetId },
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
            throw new GraphQLError('Failed to create Magma channel order');
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

@Resolver(() => RailsQueries)
export class RailsQueriesResolver {
  constructor(
    private fetchService: FetchService,
    private tapFederationService: TapFederationService,
    private ambossService: AmbossService,
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
}

@Resolver(() => MagmaOrderQueries)
export class MagmaOrderQueriesResolver {
  constructor(
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
    return {
      purchases: purchases.list.map(mapOrder),
      sales: sales.list.map(mapOrder),
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
