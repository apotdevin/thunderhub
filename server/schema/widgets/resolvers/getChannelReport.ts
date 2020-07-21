import { getChannels } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { GetChannelsType } from 'server/types/ln-service.types';

export const getChannelReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channelReport');

  const lnd = getLnd(params.auth, context);

  const info = await to<GetChannelsType>(getChannels({ lnd }));

  if (!info || info?.channels?.length <= 0) {
    return;
  }

  const { channels } = info;

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
  };
};
