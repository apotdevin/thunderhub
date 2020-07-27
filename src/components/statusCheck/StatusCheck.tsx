import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { NodeInfoType, ChannelBalanceType } from 'src/graphql/types';
import { useStatusDispatch, StatusState } from '../../context/StatusContext';
import { appendBasePath } from '../../utils/basePath';

export const StatusCheck: React.FC = () => {
  const dispatch = useStatusDispatch();
  const { push } = useRouter();

  const { data, loading, error, stopPolling } = useGetNodeInfoQuery({
    ssr: false,
    fetchPolicy: 'network-only',

    pollInterval: 10000,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Unable to connect to node`);
      stopPolling();
      dispatch({ type: 'disconnected' });
      push(appendBasePath('/'));
    }
    if (data && !loading && !error) {
      const {
        getChainBalance,
        getPendingChainBalance,
        getChannelBalance,
        getNodeInfo,
      } = data;

      const {
        alias,
        color,
        is_synced_to_chain,
        version,
        active_channels_count,
        pending_channels_count,
        closed_channels_count,
        peers_count,
      } = getNodeInfo as NodeInfoType;
      const {
        confirmedBalance,
        pendingBalance,
      } = getChannelBalance as ChannelBalanceType;

      const versionNumber = version.split(' ');
      const onlyVersion = versionNumber[0].split('-');
      const numbers = onlyVersion[0].split('.');

      const state: StatusState = {
        alias,
        color,
        syncedToChain: is_synced_to_chain,
        version: versionNumber[0],
        mayorVersion: Number(numbers[0]),
        minorVersion: Number(numbers[1]),
        revision: Number(numbers[2]),
        chainBalance: getChainBalance || 0,
        chainPending: getPendingChainBalance || 0,
        channelBalance: confirmedBalance,
        channelPending: pendingBalance,
        activeChannelCount: active_channels_count,
        pendingChannelCount: pending_channels_count,
        closedChannelCount: closed_channels_count,
        peersCount: peers_count,
      };

      dispatch({ type: 'connected', state });
    }
  }, [data, dispatch, error, loading, push, stopPolling]);

  return null;
};
