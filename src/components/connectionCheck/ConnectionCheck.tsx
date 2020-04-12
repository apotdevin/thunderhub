import { useEffect } from 'react';
import {
  useConnectionState,
  useConnectionDispatch,
} from '../../context/ConnectionContext';
import { useQuery } from '@apollo/react-hooks';
import { useAccount } from '../../context/AccountContext';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { useRouter } from 'next/router';

export const ConnectionCheck = () => {
  const { push } = useRouter();
  const { connected } = useConnectionState();
  const dispatch = useConnectionDispatch();

  const { loggedIn, host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  // useEffect(() => {
  //   !loggedIn && push('/');
  // }, [loggedIn]);

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
