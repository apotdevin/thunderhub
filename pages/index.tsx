import React from 'react';
import { useAccount } from '../src/context/AccountContext';
import { SessionLogin } from '../src/views/login/SessionLogin';
import { useRouter } from 'next/router';
import { appendBasePath } from '../src/utils/basePath';
import { LoadingView } from '../src/components/loading/LoadingView';
import { TopSection } from '../src/views/homepage/Top';
import { LoginBox } from '../src/views/homepage/LoginBox';
import { Accounts } from '../src/views/homepage/Accounts';

const ContextApp = ({ hasError }: { hasError?: boolean }) => {
  const { push } = useRouter();
  const { loggedIn, admin, viewOnly, sessionAdmin, accounts } = useAccount();

  if (loggedIn && !hasError) {
    if (admin === '' || viewOnly !== '' || sessionAdmin !== '') {
      push(appendBasePath('/home'));
      return <LoadingView />;
    }
  }

  return (
    <>
      <TopSection />
      {admin !== '' && <SessionLogin />}
      <Accounts />
      <LoginBox change={accounts.length <= 1 && admin === ''} />
    </>
  );
};

export default ContextApp;
