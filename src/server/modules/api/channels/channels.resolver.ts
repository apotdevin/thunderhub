import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { toWithError } from 'src/server/utils/async';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { getChannelAge } from './channels.helpers';
import {
  Channel,
  ClosedChannel,
  OpenChannelAuto,
  OpenChannelParams,
  OpenOrCloseChannel,
  PendingChannel,
  SingleChannel,
  UpdateRoutingFeesParams,
} from './channels.types';
import { GraphQLError } from 'graphql';
import { auto } from 'async';
import { FetchService } from '../../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { GetRecommendedNode } from '../amboss/amboss.gql';

@Resolver()
export class ChannelsResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => SingleChannel)
  async getChannel(@CurrentUser() user: UserId, @Args('id') id: string) {
    const { public_key } = await this.nodeService.getWalletInfo(user.id);

    const channel = await this.nodeService.getChannel(user.id, id);

    let node_policies = null;
    let partner_node_policies = null;

    channel.policies.forEach(policy => {
      if (public_key && public_key === policy.public_key) {
        node_policies = {
          ...policy,
          node: { publicKey: policy.public_key },
        };
      } else {
        partner_node_policies = {
          ...policy,
          node: { publicKey: policy.public_key },
        };
      }
    });

    return {
      ...channel,
      node_policies,
      partner_node_policies,
    };
  }

  @Query(() => [Channel])
  async getChannels(
    @CurrentUser() { id }: UserId,
    @Args('active', { nullable: true }) is_active?: boolean
  ) {
    const { public_key, current_block_height } =
      await this.nodeService.getWalletInfo(id);

    const { channels } = await this.nodeService.getChannels(id, { is_active });

    return channels.map(channel => ({
      ...channel,
      partner_fee_info: { localKey: public_key },
      channel_age: getChannelAge(channel.id, current_block_height),
      partner_node_info: { publicKey: channel.partner_public_key },
    }));
  }

  @Query(() => [ClosedChannel])
  async getClosedChannels(@CurrentUser() { id }: UserId) {
    const { current_block_height } = await this.nodeService.getWalletInfo(id);

    const { channels } = await this.nodeService.getClosedChannels(id);

    return channels.map(channel => ({
      ...channel,
      partner_node_info: { publicKey: channel.partner_public_key },
      channel_age: channel.close_confirm_height
        ? getChannelAge(channel.id, channel.close_confirm_height)
        : null,
      closed_for_blocks: channel.close_confirm_height
        ? current_block_height - channel.close_confirm_height
        : null,
    }));
  }

  @Query(() => [PendingChannel])
  async getPendingChannels(@CurrentUser() { id }: UserId) {
    const { pending_channels } = await this.nodeService.getPendingChannels(id);

    return pending_channels.map(channel => ({
      ...channel,
      partner_node_info: { publicKey: channel.partner_public_key },
    }));
  }

  @Mutation(() => OpenOrCloseChannel)
  async closeChannel(
    @CurrentUser() user: UserId,
    @Args('id') id: string,
    @Args('targetConfirmations', { nullable: true })
    target_confirmations: number,
    @Args('tokensPerVByte', { nullable: true }) tokens_per_vbyte: number,
    @Args('forceClose', { nullable: true }) is_force_close: boolean
  ) {
    const closeParams = {
      id,
      target_confirmations,
      tokens_per_vbyte,
      is_force_close,
    };

    this.logger.info('Closing channel with params', { closeParams });

    const info = await this.nodeService.closeChannel(user.id, closeParams);

    this.logger.info('Channel closed', { id });

    return {
      transactionId: info.transaction_id,
      transactionOutputIndex: info.transaction_vout,
    };
  }

  @Mutation(() => OpenOrCloseChannel)
  async openChannel(
    @CurrentUser() user: UserId,
    @Args('input') input: OpenChannelParams
  ): Promise<OpenOrCloseChannel> {
    const {
      is_recommended = false,
      channel_size = 0,
      partner_public_key,
      is_private,
      is_max_funding,
      give_tokens = 0,
      chain_fee_tokens_per_vbyte,
      base_fee_mtokens,
      fee_rate,
    } = input;

    const info = await auto<OpenChannelAuto>({
      checkArgs: async () => {
        if (!channel_size && !is_max_funding) {
          throw new GraphQLError('You need to specify a channel size.');
        }

        if (!is_recommended && !partner_public_key) {
          throw new GraphQLError('You need to specify a channel peer.');
        }
      },

      recommendedPeer: [
        'checkArgs',
        async (): Promise<OpenChannelAuto['recommendedPeer']> => {
          if (!is_recommended) return;

          const { data, error } =
            await this.fetchService.graphqlFetchWithProxy<{
              rails: {
                get_recommended_node: {
                  id: string;
                  pubkey: string;
                  sockets: string[];
                };
              };
            }>(this.configService.get('urls.amboss.auth'), GetRecommendedNode);

          if (!data?.rails.get_recommended_node.sockets.length || error) {
            if (error) this.logger.error(error);
            throw new Error('Error getting recommended node info');
          }

          const { pubkey, sockets } = data.rails.get_recommended_node;

          await this.nodeService.addPeer(user.id, pubkey, sockets[0], false);

          this.logger.info(
            'Connected to recommended peer for channel opening',
            { node: data.rails.get_recommended_node }
          );

          return { pubkey };
        },
      ],

      peer: [
        'checkArgs',
        async (): Promise<OpenChannelAuto['peer']> => {
          if (is_recommended) return;
          if (!partner_public_key) return;

          const parts = partner_public_key.split('@');

          const [pubkey, socket] = parts;

          if (!!socket) {
            await this.nodeService.addPeer(user.id, pubkey, socket, false);

            this.logger.info('Connected to peer for channel opening', {
              node: { pubkey, socket },
            });
          }

          return { pubkey };
        },
      ],

      openChannel: [
        'recommendedPeer',
        'peer',
        async ({
          recommendedPeer,
          peer,
        }: Pick<OpenChannelAuto, 'recommendedPeer' | 'peer'>) => {
          if (!recommendedPeer.pubkey && !peer.pubkey) {
            throw new Error('No peer provided to open channel to');
          }

          const params = {
            local_tokens: channel_size,
            partner_public_key: recommendedPeer.pubkey || peer.pubkey,
            ...(is_private ? { is_private } : {}),
            ...(give_tokens ? { give_tokens } : {}),
            ...(chain_fee_tokens_per_vbyte
              ? { chain_fee_tokens_per_vbyte }
              : {}),
            ...(is_max_funding ? { is_max_funding } : {}),
            ...(base_fee_mtokens ? { base_fee_mtokens } : {}),
            ...(fee_rate ? { fee_rate } : {}),
          };

          this.logger.info('Opening channel with params', { params });

          const info = await this.nodeService.openChannel(user.id, params);

          this.logger.info('Channel opened', { result: info });

          return {
            transactionId: info.transaction_id,
            transactionOutputIndex: info.transaction_vout,
          };
        },
      ],
    }).catch(error => {
      if (error instanceof GraphQLError) {
        throw error;
      }

      this.logger.error('Error opening channel', { input, error });

      throw new Error('Error opening channel');
    });

    return info.openChannel;
  }

  @Mutation(() => Boolean)
  async updateFees(
    @CurrentUser() user: UserId,
    @Args('transaction_id', { nullable: true }) transaction_id: string,
    @Args('transaction_vout', { nullable: true }) transaction_vout: number,
    @Args('base_fee_tokens', { nullable: true }) base_fee_tokens: number,
    @Args('fee_rate', { nullable: true }) fee_rate: number,
    @Args('cltv_delta', { nullable: true }) cltv_delta: number,
    @Args('max_htlc_mtokens', { nullable: true }) max_htlc_mtokens: string,
    @Args('min_htlc_mtokens', { nullable: true }) min_htlc_mtokens: string
  ) {
    const hasBaseFee = base_fee_tokens >= 0;
    const hasFee = fee_rate >= 0;

    if (
      !hasBaseFee &&
      !hasFee &&
      !cltv_delta &&
      !max_htlc_mtokens &&
      !min_htlc_mtokens
    ) {
      throw new Error('NoDetailsToUpdateChannel');
    }

    const baseFee =
      base_fee_tokens === 0
        ? { base_fee_tokens: 0 }
        : { base_fee_mtokens: `${Math.trunc((base_fee_tokens || 0) * 1000)}` };

    const props = {
      transaction_id,
      transaction_vout,
      ...(hasBaseFee && baseFee),
      ...(hasFee && { fee_rate }),
      ...(cltv_delta && { cltv_delta }),
      ...(max_htlc_mtokens && { max_htlc_mtokens }),
      ...(min_htlc_mtokens && { min_htlc_mtokens }),
    };

    this.logger.debug('Updating channel details with props', props);

    await this.nodeService.updateRoutingFees(user.id, props);

    return true;
  }

  @Mutation(() => Boolean)
  async updateMultipleFees(
    @CurrentUser() user: UserId,
    @Args('channels', { type: () => [UpdateRoutingFeesParams] })
    channels: UpdateRoutingFeesParams[]
  ) {
    let errors = 0;

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];

      const {
        transaction_id,
        transaction_vout,
        base_fee_tokens,
        fee_rate,
        cltv_delta,
        max_htlc_mtokens,
        min_htlc_mtokens,
      } = channel;

      const hasBaseFee = base_fee_tokens >= 0;
      const hasFee = fee_rate >= 0;

      if (
        !hasBaseFee &&
        !hasFee &&
        !cltv_delta &&
        !max_htlc_mtokens &&
        !min_htlc_mtokens
      ) {
        throw new Error('NoDetailsToUpdateChannel');
      }

      const baseFee =
        base_fee_tokens === 0
          ? { base_fee_tokens: 0 }
          : {
              base_fee_mtokens: `${Math.trunc((base_fee_tokens || 0) * 1000)}`,
            };

      const props = {
        transaction_id,
        transaction_vout,
        ...(hasBaseFee && baseFee),
        ...(hasFee && { fee_rate }),
        ...(cltv_delta && { cltv_delta }),
        ...(max_htlc_mtokens && { max_htlc_mtokens }),
        ...(min_htlc_mtokens && { min_htlc_mtokens }),
      };

      const [, error] = await toWithError(
        this.nodeService.updateRoutingFees(user.id, props)
      );

      if (error) {
        this.logger.error('Error updating channel', { error });
        errors = errors + 1;
      }
    }

    return errors ? false : true;
  }
}
