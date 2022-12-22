import { Inject } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { toWithError } from 'src/server/utils/async';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { Channel, SingleChannelParentType } from './channels.types';

@Resolver(Channel)
export class ChannelResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField()
  async time_offline(@Parent() { time_offline }: Channel) {
    return Math.round((time_offline || 0) / 1000);
  }

  @ResolveField()
  async time_online(@Parent() { time_online }: Channel) {
    return Math.round((time_online || 0) / 1000);
  }

  @ResolveField()
  async pending_resume(@Parent() { pending_payments }: Channel) {
    const total = pending_payments.reduce(
      (prev, current) => {
        const { is_outgoing, tokens } = current;

        return {
          incoming_tokens: is_outgoing
            ? prev.incoming_tokens
            : prev.incoming_tokens + tokens,
          outgoing_tokens: is_outgoing
            ? prev.outgoing_tokens + tokens
            : prev.outgoing_tokens,
          incoming_amount: is_outgoing
            ? prev.incoming_amount
            : prev.incoming_amount + 1,
          outgoing_amount: is_outgoing
            ? prev.incoming_amount + 1
            : prev.incoming_amount,
        };
      },
      {
        incoming_tokens: 0,
        outgoing_tokens: 0,
        incoming_amount: 0,
        outgoing_amount: 0,
      }
    );

    return {
      ...total,
      total_tokens: total.incoming_tokens + total.outgoing_tokens,
      total_amount: total.incoming_amount + total.outgoing_amount,
    };
  }

  @ResolveField()
  async partner_fee_info(
    @CurrentUser() user: UserId,
    @Parent()
    { id, partner_fee_info: { localKey } }: SingleChannelParentType
  ) {
    const [channel, error] = await toWithError(
      this.nodeService.getChannel(user.id, id)
    );

    if (error) {
      this.logger.debug(`Error getting channel with id ${id}`, { error });
      return null;
    }

    let node_policies = null;
    let partner_node_policies = null;

    if (channel) {
      channel.policies.forEach(policy => {
        if (localKey && localKey === policy.public_key) {
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
    }

    return {
      ...channel,
      node_policies,
      partner_node_policies,
    };
  }
}
