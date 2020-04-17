import { useEffect } from 'react';
import {
  useConnectionState,
  useConnectionDispatch,
} from '../../context/ConnectionContext';
import { useAccount } from '../../context/AccountContext';
import { useGetCanConnectQuery } from '../../generated/graphql';

export const ConnectionCheck = () => {
  const { connected } = useConnectionState();
  const dispatch = useConnectionDispatch();

  const { auth } = useAccount();

  const { data, loading } = useGetCanConnectQuery({
    variables: { auth },
    skip: connected,
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
