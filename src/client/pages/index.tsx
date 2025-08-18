import React from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { Version } from '../src/components/version/Version';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { MempoolReport } from '../src/views/home/reports/mempool';
import { LiquidityGraph } from '../src/views/home/reports/liquidReport/LiquidityGraph';
import { AccountButtons } from '../src/views/home/account/AccountButtons';
import { AccountInfo } from '../src/views/home/account/AccountInfo';
import { QuickActions } from '../src/views/home/quickActions/QuickActions';
import { FlowBox } from '../src/views/home/reports/flow';
import { ForwardBox } from '../src/views/home/reports/forwardReport';
import { ConnectCard } from '../src/views/home/connect/Connect';
import { Liquidity } from '../src/views/home/liquidity/Liquidity';

const HomeView = () => (
  <>
    <Version />
    <AccountInfo />
    <AccountButtons />
    <ConnectCard />
    <Liquidity />
    <QuickActions />
    <FlowBox />
    <LiquidityGraph />
    <ForwardBox />
    <MempoolReport />
  </>
);

const Wrapped = () => (
  <GridWrapper>
    <HomeView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
