import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAccount } from '../../context/AccountContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useGetNodeInfoQuery } from '../../generated/graphql';
import { appendBasePath } from '../../utils/basePath';

export const StatusCheck = () => {
  const dispatch = useStatusDispatch();
  const { push } = useRouter();

  const { name, auth } = useAccount();

  const { data, loading, error } = useGetNodeInfoQuery({
    skip: !auth,
    fetchPolicy: 'network-only',
    variables: { auth },
    pollInterval: 10000,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Unable to connect to ${name}`);
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
      const { alias, is_synced_to_chain, version } = getNodeInfo;
      const { confirmedBalance, pendingBalance } = getChannelBalance;

      const versionNumber = version.split(' ');
      const onlyVersion = versionNumber[0].split('-');
      const numbers = onlyVersion[0].split('.');

      const state = {
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
  }, [data, dispatch, error, loading, name, push]);

  return null;
};
