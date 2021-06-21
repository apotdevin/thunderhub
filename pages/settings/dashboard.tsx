import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import dynamic from 'next/dynamic';
import { LoadingCard } from 'src/components/loading/LoadingCard';

const LoadingComp = () => <LoadingCard noCard={true} loadingHeight={'30vh'} />;

const Dashboard = dynamic(() => import('src/views/settings/DashPanel'), {
  ssr: false,
  loading: LoadingComp,
});

const Wrapped = () => (
  <GridWrapper noNavigation={true}>
    <Dashboard />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
