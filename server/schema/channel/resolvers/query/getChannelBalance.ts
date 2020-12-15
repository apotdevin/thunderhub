import { getChannelBalance as getLnChannelBalance } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';

import { to } from 'server/helpers/async';

interface ChannelBalanceProps {
  channel_balance: number;
  pending_balance: number;
}

export const getChannelBalance = async (
  _: undefined,
  __: undefined,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channelBalance');

  const { lnd } = context;

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
