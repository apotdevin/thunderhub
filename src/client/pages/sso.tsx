import * as React from 'react';
import { useCheckAuthToken } from '../src/hooks/UseCheckAuthToken';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { LoadingCard } from '../src/components/loading/LoadingCard';

const Wrapped = () => {
  useCheckAuthToken();

  return <LoadingCard noCard={true} loadingHeight={'80vh'} />;
};

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, true);
}
