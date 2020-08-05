import * as React from 'react';
import { Spacer } from 'src/components/spacer/Spacer';
import { ServerAccounts } from 'src/components/accounts/ServerAccounts';
import { ThunderStorm } from 'src/views/homepage/HomePage.styled';
import { NextPageContext } from 'next';
import { GET_SERVER_ACCOUNTS } from 'src/graphql/queries/getServerAccounts';
import { getProps } from 'src/utils/ssr';
import { TopSection } from '../src/views/homepage/Top';
import { Accounts } from '../src/views/homepage/Accounts';

const ContextApp = () => (
  <>
    <ThunderStorm alt={''} src={'/static/thunderstorm.gif'} />
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
  return await getProps(context, [GET_SERVER_ACCOUNTS]);
}
