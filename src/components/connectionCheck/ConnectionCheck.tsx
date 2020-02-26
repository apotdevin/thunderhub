import { useEffect } from 'react';
import {
    useConnectionState,
    useConnectionDispatch,
} from 'context/ConnectionContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from 'graphql/query';
import { useAccount } from 'context/AccountContext';
import { getAuthString } from 'utils/auth';

export const ConnectionCheck = () => {
    const { connected } = useConnectionState();
    const dispatch = useConnectionDispatch();

    const { loggedIn, host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(
        host,
        viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    );

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
    }, [data, loading]);

    return null;
};
