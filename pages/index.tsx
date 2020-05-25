import * as React from 'react';
import { Spacer } from 'src/components/spacer/Spacer';
import { withApollo } from 'config/client';
import { ServerAccounts } from 'src/components/accounts/ServerAccounts';
import { AuthSSOCheck } from 'src/components/accounts/AuthSSOCheck';
import { SessionLogin } from '../src/views/login/SessionLogin';
import { TopSection } from '../src/views/homepage/Top';
import { LoginBox } from '../src/views/homepage/LoginBox';
import { Accounts } from '../src/views/homepage/Accounts';
import { useStatusState } from '../src/context/StatusContext';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { Section } from '../src/components/section/Section';

const ContextApp = () => {
  const { loading } = useStatusState();
  return (
    <>
      <TopSection />
      {loading && (
        <Section withColor={false}>
          <LoadingCard
            inverseColor={true}
            loadingHeight={'160px'}
            title={`Connecting to ${name}`}
          />
        </Section>
      )}
      {!loading && (
        <>
          <SessionLogin />
          <Accounts />
          <LoginBox />
        </>
      )}
      <Spacer />
    </>
  );
};

const Wrapped = () => (
  <>
    <AuthSSOCheck />
    <ServerAccounts />
    <ContextApp />
  </>
);

export default withApollo(Wrapped);
