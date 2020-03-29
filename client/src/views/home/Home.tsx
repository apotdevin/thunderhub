import React from 'react';
import { NetworkInfo } from './networkInfo/NetworkInfo';
import { AccountInfo } from './account/AccountInfo';
import { QuickActions } from './quickActions/QuickActions';
import { FlowBox } from './reports/flow';
import { ForwardBox } from './reports/forwardReport';
import { LiquidReport } from './reports/liquidReport/LiquidReport';
import { ConnectCard } from './connect/Connect';
import { NodeBar } from 'components/nodeInfo/NodeBar';

export const Home = () => {
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
