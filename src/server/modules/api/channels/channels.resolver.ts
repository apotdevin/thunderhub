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
  OpenOrCloseChannel,
  PendingChannel,
  SingleChannel,
  UpdateRoutingFeesParams,
} from './channels.types';

@Resolver()
export class ChannelsResolver {
  constructor(
    private nodeService: NodeService,
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
    @Args('amount') local_tokens: number,
    @Args('partnerPublicKey') partner_public_key: string,
    @Args('isPrivate', { nullable: true }) is_private: boolean,
    @Args('pushTokens', { nullable: true, defaultValue: 0 }) pushTokens: number,
    @Args('tokensPerVByte', { nullable: true })
    chain_fee_tokens_per_vbyte: number
  ) {
    let public_key = partner_public_key;

    if (partner_public_key.indexOf('@') >= 0) {
      const parts = partner_public_key.split('@');
      public_key = parts[0];
      await this.nodeService.addPeer(user.id, public_key, parts[1], false);
    }

    const openParams = {
      is_private,
      local_tokens,
      chain_fee_tokens_per_vbyte,
      partner_public_key: public_key,
      give_tokens: Math.min(pushTokens, local_tokens),
    };

    this.logger.info('Opening channel with params', { openParams });

    const info = await this.nodeService.openChannel(user.id, openParams);

    this.logger.info('Channel opened');

    return {
      transactionId: info.transaction_id,
      transactionOutputIndex: info.transaction_vout,
    };
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
