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

    const { loggedIn, host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    useQuery(GET_CAN_CONNECT, {
        variables: { auth },
        skip: connected || !loggedIn,
        onError: () => {
            dispatch({ type: 'error' });
        },
        onCompleted: () => {
            dispatch({ type: 'connected' });
        },
    });

    return null;
};
