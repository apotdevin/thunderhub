import { useAccount } from '../../context/AccountContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useEffect } from 'react';
import { useGetNodeInfoQuery } from '../../generated/graphql';

export const StatusCheck = () => {
  const dispatch = useStatusDispatch();

  const { loggedIn, auth } = useAccount();

  const { data, loading, error, stopPolling } = useGetNodeInfoQuery({
    fetchPolicy: 'network-only',
    variables: { auth },
    skip: !loggedIn || !auth,
    pollInterval: 10000,
    onError: () => dispatch({ type: 'error' }),
  });

  useEffect(() => {
    if (!loggedIn) {
      stopPolling();
    }
  }, [loggedIn, stopPolling]);

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
        error: false,
        connected: true,
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
