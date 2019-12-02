import React from 'react';
import { NetworkInfo } from '../../components/networkInfo/NetworkInfo';
import { AccountInfo } from '../../components/account/AccountInfo';
import { ForwardBox } from '../../components/forwardReport';
import { QuickActions } from '../../components/quickActions/QuickActions';

export const Home = () => {
    return (
        <>
            <AccountInfo />
            <QuickActions />
            <ForwardBox />
            <NetworkInfo />
        </>
    );
};
