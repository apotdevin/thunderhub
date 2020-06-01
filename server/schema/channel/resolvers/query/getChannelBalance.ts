import { getChannelBalance as getLnChannelBalance } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from '../../../../helpers/logger';
import { requestLimiter } from '../../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../../helpers/helpers';

interface ChannelBalanceProps {
  channel_balance: number;
  pending_balance: number;
}

export const getChannelBalance = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channelBalance');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  try {
    const channelBalance: ChannelBalanceProps = await getLnChannelBalance({
      lnd,
    });
    return {
      confirmedBalance: channelBalance.channel_balance,
      pendingBalance: channelBalance.pending_balance,
    };
  } catch (error) {
    logger.error('Error getting channel balance: %o', error);
    throw new Error(getErrorMsg(error));
  }
};
