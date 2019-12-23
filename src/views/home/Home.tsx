import React from 'react';
import { NetworkInfo } from '../../components/networkInfo/NetworkInfo';
import { AccountInfo } from '../../components/account/AccountInfo';
import { QuickActions } from '../../components/quickActions/QuickActions';
import { FlowBox } from '../../components/reports/flow';
import { ForwardBox } from '../../components/reports/forwardReport';
import { LiquidReport } from '../../components/reports/liquidReport/LiquidReport';
import { ConnectCard } from '../../components/connect/Connect';

export const Home = () => {
    return (
        <>
            <AccountInfo />
            <ConnectCard />
            <QuickActions />
            <FlowBox />
            <LiquidReport />
            <ForwardBox />
            <NetworkInfo />
        </>
    );
};
