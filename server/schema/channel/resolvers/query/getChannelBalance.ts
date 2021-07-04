import {
  getChannelBalance as getLnChannelBalance,
  getChannels,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { GetChannelsType } from 'server/types/ln-service.types';

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

  const { channels } = await to<GetChannelsType>(getChannels({ lnd }));

  const channelBalance: ChannelBalanceProps = await to(
    getLnChannelBalance({
      lnd,
    })
  );

  const localBalances = channels
    .filter(c => c.is_active)
    .map(c => c.local_balance)
    .reduce((total, size) => total + size, 0);

  const commit = channels
    .filter(c => !c.is_partner_initiated)
    .map(c => c.commit_transaction_fee)
    .reduce((total, fee) => total + fee, 0);

  return {
    confirmedBalance: localBalances - commit,
    pendingBalance: channelBalance.pending_balance,
  };
};
