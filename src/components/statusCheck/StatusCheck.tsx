import { useConnectionState } from '../../context/ConnectionContext';
import { useAccount } from '../../context/AccountContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useGetNodeInfoQuery } from '../../generated/graphql';

export const StatusCheck = () => {
  const { connected } = useConnectionState();
  const dispatch = useStatusDispatch();

  const { loggedIn, auth } = useAccount();

  const { data, loading, error, stopPolling } = useGetNodeInfoQuery({
    variables: { auth },
    skip: !connected || !loggedIn || !auth,
    pollInterval: 10000,
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!connected || !loggedIn) {
      stopPolling();
    }
  }, [connected, loggedIn, stopPolling]);

  useEffect(() => {
    if (data && !loading && !error) {
      const {
        getChainBalance,
        getPendingChainBalance,
        getChannelBalance,
        getNodeInfo,
      } = data;
      const { alias, is_synced_to_chain, version } = getNodeInfo;
      const { confirmedBalance, pendingBalance } = getChannelBalance;

      const versionNumber = version.split(' ');
      const onlyVersion = versionNumber[0].split('-');
      const numbers = onlyVersion[0].split('.');

      const state = {
        loading: false,
        alias,
        syncedToChain: is_synced_to_chain,
        version: versionNumber[0],
        mayorVersion: Number(numbers[0]),
        minorVersion: Number(numbers[1]),
        revision: Number(numbers[2]),
        chainBalance: getChainBalance,
        chainPending: getPendingChainBalance,
        channelBalance: confirmedBalance,
        channelPending: pendingBalance,
      };

      dispatch({ type: 'connected', state });
    }
  }, [data, dispatch, error, loading]);

  return null;
};
