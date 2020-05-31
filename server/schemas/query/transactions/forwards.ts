import { GraphQLString } from 'graphql';
import { getForwards as getLnForwards, getWalletInfo } from 'ln-service';
import { sortBy } from 'underscore';
import { subHours, subDays, subMonths, subYears } from 'date-fns';
import { ContextType } from 'server/types/apiTypes';
import { getNodeFromChannel } from 'server/schemas/helpers/getNodeFromChannel';
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

export const getForwards = {
  type: GetForwardType,
  args: {
    ...defaultParams,
    time: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'forwards');

    const auth = getCorrectAuth(params.auth, context);
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

    const getAlias = (array: any[], publicKey: string) =>
      Promise.all(
        array.map(async forward => {
          const inNodeAlias = await getNodeFromChannel(
            forward.incoming_channel,
            publicKey,
            lnd
          );
          const outNodeAlias = await getNodeFromChannel(
            forward.outgoing_channel,
            publicKey,
            lnd
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
