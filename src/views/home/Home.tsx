import React from 'react';
import { NetworkInfo } from '../../components/networkInfo/NetworkInfo';
import { AccountInfo } from '../../components/account/AccountInfo';
import { QuickActions } from '../../components/quickActions/QuickActions';
import { FlowBox } from '../../components/reports/flow';
import { ForwardBox } from '../../components/reports/forwardReport';
import { LiquidReport } from '../../components/reports/liquidReport/LiquidReport';

export const Home = () => {
    return (
        <>
            <AccountInfo />
            <QuickActions />
            <FlowBox />
            <LiquidReport />
            <ForwardBox />
            <NetworkInfo />
        </>
    );
};
