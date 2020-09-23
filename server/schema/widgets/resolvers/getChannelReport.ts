import { getChannels } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { GetChannelsType } from 'server/types/ln-service.types';

export const getChannelReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channelReport');

  const { lnd } = context;

  const info = await to<GetChannelsType>(getChannels({ lnd }));

  if (!info || info?.channels?.length <= 0) {
    return;
  }

  const { channels } = info;

  const pending = channels.reduce(
    (prev, current) => {
      const { pending_payments } = current;

      const total = pending_payments.length;
      const outgoing = pending_payments.filter(p => p.is_outgoing).length;
      const incoming = total - outgoing;

      return {
        totalPendingHtlc: prev.totalPendingHtlc + total,
        outgoingPendingHtlc: prev.outgoingPendingHtlc + outgoing,
        incomingPendingHtlc: prev.incomingPendingHtlc + incoming,
      };
    },
    {
      totalPendingHtlc: 0,
      outgoingPendingHtlc: 0,
      incomingPendingHtlc: 0,
    }
  );

  const commit = channels
    .filter(c => !c.is_partner_initiated)
    .map(c => c.commit_transaction_fee)
    .reduce((total, fee) => total + fee, 0);

  const localBalances = channels
    .filter(c => c.is_active)
    .map(c => c.local_balance);

  const remoteBalances = channels
    .filter(c => c.is_active)
    .map(c => c.remote_balance);

  const local = localBalances.reduce((total, size) => total + size, 0) - commit;
  const remote = remoteBalances.reduce((total, size) => total + size, 0);
  const maxOut = Math.max(...localBalances);
  const maxIn = Math.max(...remoteBalances);

  return {
    local,
    remote,
    maxIn,
    maxOut,
    commit,
    ...pending,
  };
};
