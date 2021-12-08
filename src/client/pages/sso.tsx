import * as React from 'react';
import { ServerAccounts } from '../src/components/accounts/ServerAccounts';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { LoadingCard } from '../src/components/loading/LoadingCard';

const Wrapped = () => (
  <>
    <ServerAccounts />
    <LoadingCard noCard={true} loadingHeight={'80vh'} />
  </>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, true);
}
