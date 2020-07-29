import * as React from 'react';
import { Spacer } from 'src/components/spacer/Spacer';
import { ServerAccounts } from 'src/components/accounts/ServerAccounts';
import { ThunderStorm } from 'src/views/homepage/HomePage.styled';
import { appendBasePath } from 'src/utils/basePath';
import { NextPageContext } from 'next';
import { TopSection } from '../src/views/homepage/Top';
import { Accounts } from '../src/views/homepage/Accounts';
import { cookieProps } from '../src/utils/cookies';

const ContextApp = () => (
  <>
    <ThunderStorm alt={''} src={appendBasePath('/static/thunderstorm.gif')} />
    <TopSection />
    <Accounts />
    <Spacer />
  </>
);

const Wrapped = () => (
  <>
    <ServerAccounts />
    <ContextApp />
  </>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return cookieProps(context);
}
