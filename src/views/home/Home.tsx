import React from 'react';
import { NetworkInfo } from '../../components/networkInfo/NetworkInfo';
import { PayCard } from '../../components/pay/pay';
import { CreateInvoiceCard } from '../../components/createInvoice/CreateInvoice';
import { AccountInfo } from '../../components/account/AccountInfo';
import { ForwardBox } from '../../components/forwardReport';

export const Home = () => {
    return (
        <>
            <AccountInfo />
            <PayCard />
            <CreateInvoiceCard />
            <ForwardBox />
            <NetworkInfo />
        </>
    );
};
