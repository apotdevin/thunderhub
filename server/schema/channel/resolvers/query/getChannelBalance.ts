import { getChannelBalance as getLnChannelBalance } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';

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

  const channelBalance: ChannelBalanceProps = await to(
    getLnChannelBalance({
      lnd,
    })
  );
  return {
    confirmedBalance: channelBalance.channel_balance,
    pendingBalance: channelBalance.pending_balance,
  };
};
