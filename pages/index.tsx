import * as React from 'react';
import { Spacer } from 'src/components/spacer/Spacer';
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

export default ContextApp;
