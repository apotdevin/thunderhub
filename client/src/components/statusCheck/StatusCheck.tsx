import { useConnectionState } from 'context/ConnectionContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_NODE_INFO } from 'graphql/query';
import { useAccount } from 'context/AccountContext';
import { useStatusDispatch } from 'context/StatusContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from 'utils/error';

export const StatusCheck = () => {
    const { connected } = useConnectionState();
    const dispatch = useStatusDispatch();

    const { loggedIn, host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = {
        host,
        macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    };

    const { data, loading, error, stopPolling } = useQuery(GET_NODE_INFO, {
        variables: { auth },
        skip: !connected || !loggedIn,
        pollInterval: 10000,
        onError: (error) => toast.error(getErrorContent(error)),
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
                mayorVersion: numbers[0],
                minorVersion: numbers[1],
                revision: numbers[2],
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
