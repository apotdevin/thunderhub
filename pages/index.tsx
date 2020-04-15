// import App from 'next/app';
import React from 'react';
import { useAccount } from '../src/context/AccountContext';
import { SessionLogin } from '../src/views/login/SessionLogin';
import { useRouter } from 'next/router';
import { HomePageView } from '../src/views/homepage/HomePage';
import { appendBasePath } from '../src/utils/basePath';

const ContextApp: React.FC = () => {
  const { push } = useRouter();
  const { loggedIn, admin, viewOnly, sessionAdmin } = useAccount();

  if (loggedIn) {
    if (admin === '' || viewOnly !== '' || sessionAdmin !== '') {
      push(appendBasePath('/home'));
    }
  }

  return !loggedIn && admin === '' ? <HomePageView /> : <SessionLogin />;
};

export default ContextApp;
