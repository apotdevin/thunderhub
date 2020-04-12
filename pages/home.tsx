import React from 'react';
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

export default HomeView;
