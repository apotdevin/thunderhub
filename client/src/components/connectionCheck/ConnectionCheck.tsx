import { useEffect } from 'react';
import {
    useConnectionState,
    useConnectionDispatch,
} from 'context/ConnectionContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from 'graphql/query';
import { useAccount } from 'context/AccountContext';

export const ConnectionCheck = () => {
    const { connected } = useConnectionState();
    const dispatch = useConnectionDispatch();

    const { loggedIn, host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = {
        host,
        macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    };

    const { data, loading } = useQuery(GET_CAN_CONNECT, {
        variables: { auth },
        skip: connected || !loggedIn,
        onError: () => {
            dispatch({ type: 'error' });
        },
    });

    useEffect(() => {
        if (!loading && data && data.getNodeInfo) {
            dispatch({ type: 'connected' });
        }
    }, [data, loading, dispatch]);

    return null;
};
