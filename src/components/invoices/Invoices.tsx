import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_INVOICES } from '../../graphql/query';
import { Card, CardWithTitle, SubTitle } from '../generic/Styled';
import { InvoiceCard } from './InvoiceCard';
import { AccountContext } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const Invoices = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(GET_INVOICES, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getInvoices) {
        return <Card>Loading....</Card>;
    }

    const renderInvoices = () => {
        return (
            <CardWithTitle>
                <SubTitle>Invoices</SubTitle>
                <Card>
                    {data.getInvoices.map((invoice: any, index: number) => {
                        return (
                            <InvoiceCard
                                invoice={invoice}
                                key={index}
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
