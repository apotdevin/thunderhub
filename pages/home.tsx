import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import { Version } from 'src/components/version/Version';
import { NetworkInfo } from '../src/views/home/networkInfo/NetworkInfo';
import { AccountInfo } from '../src/views/home/account/AccountInfo';
import { QuickActions } from '../src/views/home/quickActions/QuickActions';
import { FlowBox } from '../src/views/home/reports/flow';
import { ForwardBox } from '../src/views/home/reports/forwardReport';
import { LiquidReport } from '../src/views/home/reports/liquidReport/LiquidReport';
import { ConnectCard } from '../src/views/home/connect/Connect';
import { NodeBar } from '../src/components/nodeInfo/NodeBar';

const HomeView = () => {
  return (
    <>
      <Version />
      <AccountInfo />
      <NodeBar />
      <ConnectCard />
      <QuickActions />
      <FlowBox />
      <LiquidReport />
      <ForwardBox />
      <NetworkInfo />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <HomeView />
  </GridWrapper>
);

export default withApollo(Wrapped);
