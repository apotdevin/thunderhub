import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import {
    CardWithTitle,
    SubTitle,
    Card,
    CardTitle,
    Sub4Title,
} from '../../generic/Styled';
import { ButtonRow } from '../forwardReport/Buttons';
import { FlowReport } from './FlowReport';
import { getAuthString } from '../../../utils/auth';
import { AccountContext } from '../../../context/AccountContext';
import { GET_IN_OUT } from '../../../graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { FlowPie } from './FlowPie';
import { InvoicePie } from './InvoicePie';

export const ChannelRow = styled.div`
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Row = styled.div`
    display: flex;
`;

export const PieRow = styled(Row)`
    justify-content: space-between;
`;

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-width: 200px;
`;

const HalfCardWithTitle = styled(CardWithTitle)`
    width: 50%;
`;

interface PeriodProps {
    period: number;
    amount: number;
    tokens: number;
}

const availableTimes = ['day', 'week', 'month'];
const mappedTimes = ['Day', 'Week', 'Month'];
const availableTypes = ['amount', 'tokens'];
const mappedTypes = ['Amount', 'Value'];
const buttonBorder = `#FD5F00`;

export const FlowBox = () => {
    const [isTime, setIsTime] = useState<string>('month');
    const [isType, setIsType] = useState<string>('amount');

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);
    const { data, loading, error } = useQuery(GET_IN_OUT, {
        variables: { time: isTime, auth },
    });

    const buttonProps = {
        isTime,
        isType,
        setIsTime,
        setIsType,
        availableTimes,
        availableTypes,
        mappedTimes,
        mappedTypes,
        buttonBorder,
    };

    if (!data || loading) {
        return <div>Loading</div>;
    }

    const parsedData: PeriodProps[] = JSON.parse(data.getInOut.invoices);
    const parsedData2: PeriodProps[] = JSON.parse(data.getInOut.payments);

    if (parsedData.length <= 0) {
        return <p>Your node has not forwarded any payments.</p>;
    }

    const reduce = (array: PeriodProps[]) =>
        array.reduce((p, c) => {
            return {
                tokens: p.tokens + c.tokens,
                period: 0,
                amount: p.amount + c.amount,
            };
        });

    const totalInvoices: any = reduce(parsedData);
    const totalPayments: any = reduce(parsedData2);

    const flowPie = [
        { x: 'Invoice', y: totalInvoices[isType] },
        { x: 'Payments', y: totalPayments[isType] },
    ];

    const invoicePie = [
        { x: 'Confirmed', y: data.getInOut.confirmedInvoices },
        { x: 'Unconfirmed', y: data.getInOut.unConfirmedInvoices },
    ];

    const props = { isTime, isType, parsedData, parsedData2 };
    const pieProps = { invoicePie };
    const flowProps = { flowPie, isType };

    return (
        <>
            <CardWithTitle>
                <CardTitle>
                    <SubTitle>Invoices and Payments Report</SubTitle>
                    <ButtonRow {...buttonProps} />
                </CardTitle>
                <Card bottom={'10px'}>
                    <FlowReport {...props} />
                </Card>
            </CardWithTitle>
            <Row>
                <HalfCardWithTitle>
                    <CardTitle>
                        <Sub4Title>Total</Sub4Title>
                    </CardTitle>
                    <Card>
                        <FlowPie {...flowProps} />
                    </Card>
                </HalfCardWithTitle>
                <div style={{ width: '20px' }} />
                <HalfCardWithTitle>
                    <CardTitle>
                        <Sub4Title>Invoices</Sub4Title>
                    </CardTitle>
                    <Card>
                        <InvoicePie {...pieProps} />
                    </Card>
                </HalfCardWithTitle>
            </Row>
        </>
    );
};
