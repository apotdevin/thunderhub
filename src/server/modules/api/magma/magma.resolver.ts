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
import { AmbossService } from '../amboss/amboss.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from '../../../utils/async';
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
  taproot_asset_details?: { asset_id?: string; group_key?: string };
  prices?: { id?: string; usd?: number };
}

@Resolver()
export class MagmaResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    private nodeService: NodeService,
    private fetchService: FetchService,
    private ambossService: AmbossService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // ── Trading Offers ──

  @Query(() => TapTradeOfferList)
  async getTapOffers(
    @CurrentUser() _user: UserId,
    @Context() { ambossAuth }: ContextType,
    @Args('input') input: GetTapOffersInput
  ) {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) {
      return { list: [], totalCount: 0 };
    }

    const headers = ambossAuth ? { authorization: `Bearer ${ambossAuth}` } : {};

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        offers: {
          list: TradeApiOffer[];
          total_count: number;
        };
      };
    }>(
      tradeUrl,
      getOffersQuery,
      {
        input: {
          asset_id: input.assetId,
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
      },
      headers
    );

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

    return {
      list: assets.list.map(a => ({
        id: a.id,
        symbol: a.symbol || '',
        description: a.description,
        precision: a.precision ?? 0,
        assetId: a.taproot_asset_details?.asset_id,
        groupKey: a.taproot_asset_details?.group_key,
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
        if (!input.amount || BigInt(input.amount) <= 0) {
          throw new GraphQLError('Amount must be greater than zero');
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

          // rate (assetRate) is in atomic-asset-units per BTC (full_amount from trade API)
          // For PURCHASE: user inputs sats → Magma inbound asset channel size in atomic units
          //   atomic_asset = sats * rate / 1e8
          // For SALE: user inputs display asset units → Magma inbound BTC channel size in sats
          //   Convert display units to atomic first, then to sats: sats = (amount * 10^precision) * 1e8 / rate
          const precisionMultiplier = BigInt(10 ** input.assetPrecision);
          const magmaSize =
            input.transactionType === TapTransactionType.PURCHASE
              ? (
                  (BigInt(input.amount) * BigInt(input.assetRate)) /
                  BigInt(100_000_000)
                ).toString()
              : (
                  (BigInt(input.amount) *
                    precisionMultiplier *
                    BigInt(100_000_000)) /
                  BigInt(input.assetRate)
                ).toString();

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
                  options: { asset_id: input.assetId },
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
            amountSats: order.size,
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

          const [payResult, error] = await toWithError(
            this.nodeService.pay(user.id, { request: magmaOrder.invoice })
          );

          if (error || !payResult?.is_confirmed) {
            this.logger.error('Failed to pay Magma invoice', {
              error,
              payResult,
            });
            throw new GraphQLError('Failed to pay Magma invoice');
          }

          this.logger.info('Magma invoice paid', {
            orderId: magmaOrder.id,
          });
        },
      ],

      outboundChannel: [
        'peer',
        'payMagma',
        async (): Promise<SetupTradePartnerAuto['outboundChannel']> => {
          if (input.transactionType === TapTransactionType.PURCHASE) {
            const [channelResult, error] = await toWithError(
              this.nodeService.openChannel(user.id, {
                local_tokens: Number(input.amount),
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
              assetAmount: Number(input.amount),
              assetId: input.assetId,
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
      outboundChannelTxid: result.outboundChannel.txid,
      outboundChannelOutputIndex: result.outboundChannel.outputIndex,
    };
  }
}
