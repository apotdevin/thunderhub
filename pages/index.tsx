import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { SSO_USER } from 'src/utils/auth';
import { useAccount } from '../src/context/AccountContext';
import { SessionLogin } from '../src/views/login/SessionLogin';
import { appendBasePath } from '../src/utils/basePath';
import { TopSection } from '../src/views/homepage/Top';
import { LoginBox } from '../src/views/homepage/LoginBox';
import { Accounts } from '../src/views/homepage/Accounts';
import {
  useStatusState,
  useStatusDispatch,
} from '../src/context/StatusContext';
import { useGetCanConnectLazyQuery } from '../src/generated/graphql';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { Section } from '../src/components/section/Section';

const ContextApp = () => {
  const { push } = useRouter();
  const {
    name,
    host,
    cert,
    admin,
    viewOnly,
    sessionAdmin,
    accounts,
  } = useAccount();
  const { loading: statusLoading } = useStatusState();
  const dispatch = useStatusDispatch();

  const change =
    accounts.length <= 1 &&
    accounts.filter(a => a.host === SSO_USER).length < 1 &&
    admin === '';
  const isSession = admin !== '' && viewOnly === '';

  const [getCanConnect, { data, loading, error }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error(`Unable to connect to ${name}`);
      dispatch({ type: 'disconnected' });
    },
  });

  useEffect(() => {
    if (loading && !error) {
      dispatch({ type: 'loading' });
    }
    if (!loading && data?.getNodeInfo && !error) {
      dispatch({ type: 'connected' });
      push(appendBasePath('/home'));
    }
  }, [loading, data, error, dispatch, push]);

  useEffect(() => {
    if (viewOnly !== '' || sessionAdmin !== '') {
      getCanConnect({
        variables: {
          auth: {
            host,
            macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
            cert,
          },
        },
      });
    }
  }, [viewOnly, sessionAdmin, getCanConnect, cert, host]);

  return (
    <>
      <TopSection />
      {statusLoading && (
        <Section withColor={false}>
          <LoadingCard
            inverseColor={true}
            loadingHeight={'160px'}
            title={`Connecting to ${name}`}
          />
        </Section>
      )}
      {!statusLoading && (
        <>
          {isSession && <SessionLogin />}
          <Accounts change={!isSession} />
          <LoginBox change={change} />
        </>
      )}
    </>
  );
};

export default ContextApp;
