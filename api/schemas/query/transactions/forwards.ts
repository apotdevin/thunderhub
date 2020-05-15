import { GraphQLString } from 'graphql';
import {
  getForwards as getLnForwards,
  getChannel,
  getNode,
  getWalletInfo,
} from 'ln-service';
import { sortBy } from 'underscore';
import { subHours, subDays, subMonths, subYears } from 'date-fns';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { ForwardCompleteProps } from '../report/ForwardReport.interface';
import { defaultParams } from '../../../helpers/defaultProps';
import { GetForwardType } from '../../types/QueryType';

interface NodeProps {
  alias: string;
  color: string;
}

interface ChannelsProps {
  policies: { public_key: string }[];
}

export const getForwards = {
  type: GetForwardType,
  args: {
    ...defaultParams,
    time: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'forwards');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    let startDate = new Date();
    const endDate = new Date();

    if (params.time === 'oneYear') {
      startDate = subYears(endDate, 1);
    } else if (params.time === 'sixMonths') {
      startDate = subMonths(endDate, 6);
    } else if (params.time === 'threeMonths') {
      startDate = subMonths(endDate, 3);
    } else if (params.time === 'month') {
      startDate = subMonths(endDate, 1);
    } else if (params.time === 'week') {
      startDate = subDays(endDate, 7);
    } else {
      startDate = subHours(endDate, 24);
    }

    const walletInfo: { public_key: string } = await getWalletInfo({
      lnd,
    });

    const getNodeAlias = async (id: string, publicKey: string) => {
      const channelInfo: ChannelsProps = await getChannel({
        lnd,
        id,
      });

      const partnerPublicKey =
        channelInfo.policies[0].public_key !== publicKey
          ? channelInfo.policies[0].public_key
          : channelInfo.policies[1].public_key;

      const nodeInfo: NodeProps = await getNode({
        lnd,
        is_omitting_channels: true,
        public_key: partnerPublicKey,
      });

      return {
        alias: nodeInfo.alias,
        color: nodeInfo.color,
      };
    };

    const getAlias = (array: any[], publicKey: string) =>
      Promise.all(
        array.map(async forward => {
          const inNodeAlias = await getNodeAlias(
            forward.incoming_channel,
            publicKey
          );
          const outNodeAlias = await getNodeAlias(
            forward.outgoing_channel,
            publicKey
          );
          return {
            incoming_alias: inNodeAlias.alias,
            incoming_color: inNodeAlias.color,
            outgoing_alias: outNodeAlias.alias,
            outgoing_color: outNodeAlias.color,
            ...forward,
          };
        })
      );

    try {
      const forwardsList: ForwardCompleteProps = await getLnForwards({
        lnd,
        after: startDate,
        before: endDate,
      });

      const list = await getAlias(forwardsList.forwards, walletInfo.public_key);

      const forwards = sortBy(list, 'created_at').reverse();
      return {
        token: forwardsList.next,
        forwards,
      };
    } catch (error) {
      logger.error('Error getting forwards: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
