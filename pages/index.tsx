import * as React from 'react';
import { Spacer } from 'src/components/spacer/Spacer';
import { ServerAccounts } from 'src/components/accounts/ServerAccounts';
import { ThunderStorm } from 'src/views/homepage/HomePage.styled';
import { appendBasePath } from 'src/utils/basePath';
import { NextPageContext } from 'next';
import { initializeApollo } from 'config/client';
import { GET_SERVER_ACCOUNTS } from 'src/graphql/queries/getServerAccounts';
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
  const { props } = cookieProps(context);
  const apolloClient = initializeApollo(undefined, context.req, context.res);

  await apolloClient.query({
    query: GET_SERVER_ACCOUNTS,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      ...props,
    },
  };
}
