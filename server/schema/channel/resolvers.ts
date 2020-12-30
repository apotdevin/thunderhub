import { logger } from 'server/helpers/logger';
import { toWithError } from 'server/helpers/async';
import { getChannel } from 'ln-service';
import { ChannelType, GetChannelType } from 'server/types/ln-service.types';
import { openChannel } from './resolvers/mutation/openChannel';
import { closeChannel } from './resolvers/mutation/closeChannel';
import { updateFees } from './resolvers/mutation/updateFees';
import { updateMultipleFees } from './resolvers/mutation/updateMultipleFees';
import { getChannelBalance } from './resolvers/query/getChannelBalance';
import { getChannels } from './resolvers/query/getChannels';
import { getClosedChannels } from './resolvers/query/getClosedChannels';
import { getPendingChannels } from './resolvers/query/getPendingChannels';

type ParentType = {
  id: string;
  partner_fee_info: {
    lnd: {};
    localKey: String;
  };
};

export const channelResolvers = {
  Query: {
    getChannelBalance,
    getChannels,
    getClosedChannels,
    getPendingChannels,
  },
  Mutation: {
    openChannel,
    closeChannel,
    updateFees,
    updateMultipleFees,
  },
  channelType: {
    partner_fee_info: async ({
      id,
      partner_fee_info: { lnd, localKey },
    }: ParentType) => {
      if (!lnd) {
        logger.debug('ExpectedLNDToGetChannel');
        return null;
      }

      if (!id) {
        logger.debug('ExpectedIdToGetChannel');
        return null;
      }

      const [channel, error] = await toWithError<GetChannelType>(
        getChannel({ lnd, id })
      );

      if (error) {
        logger.debug(`Error getting channel with id ${id}: %o`, error);
        return null;
      }

      let node_policies = null;
      let partner_node_policies = null;

      if (channel) {
        channel.policies.forEach(policy => {
          if (localKey && localKey === policy.public_key) {
            node_policies = {
              ...policy,
              node: { lnd, publicKey: policy.public_key },
            };
          } else {
            partner_node_policies = {
              ...policy,
              node: { lnd, publicKey: policy.public_key },
            };
          }
        });
      }

      return {
        ...(channel as GetChannelType),
        node_policies,
        partner_node_policies,
      };
    },
    pending_resume({ pending_payments }: ChannelType) {
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
    },
  },
};
