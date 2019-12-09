import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PAYMENTS } from '../../graphql/query';
import { Card, CardWithTitle, SubTitle } from '../generic/Styled';
import { PaymentsCard } from './PaymentsCards';
import { AccountContext } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';

export const Payments = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, error, data } = useQuery(GET_PAYMENTS, {
        variables: { auth },
    });

    console.log(loading, error, data);

    if (loading || !data || !data.getPayments) {
        return <Card>Loading....</Card>;
    }

    const renderInvoices = () => {
        return (
            <CardWithTitle>
                <SubTitle>Payments</SubTitle>
                <Card>
                    {data.getPayments.map((payment: any, index: number) => {
                        return (
                            <PaymentsCard
                                payment={payment}
                                index={index + 1}
                                setIndexOpen={setIndexOpen}
                                indexOpen={indexOpen}
                            />
                        );
                    })}
                </Card>
            </CardWithTitle>
        );
    };

    return renderInvoices();
};
