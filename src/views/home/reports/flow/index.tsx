import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
  Sub4Title,
} from '../../../../components/generic/Styled';
import { ButtonRow } from '../forwardReport/Buttons';
import { FlowReport } from './FlowReport';
import { useAccount } from '../../../../context/AccountContext';
import { useQuery } from '@apollo/react-hooks';
import { FlowPie } from './FlowPie';
import { InvoicePie } from './InvoicePie';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useSize } from '../../../../hooks/UseSize';
import { mediaDimensions } from '../../../../styles/Themes';
import { GET_IN_OUT } from '../../../../graphql/query';
// import { getWaterfall } from './Helpers';

export const ChannelRow = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;

  @media (max-width: 770px) {
    ${({ noWrap }: { noWrap?: boolean }) =>
      !noWrap &&
      css`
        flex-wrap: wrap;
      `};
  }
`;

export const PieRow = styled(Row)`
  justify-content: space-between;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 200px;

  @media (max-width: 770px) {
    min-width: unset;
    width: 100%;
    padding-bottom: 16px;
  }
`;

const HalfCardWithTitle = styled(CardWithTitle)`
  width: 50%;
`;

export interface PeriodProps {
  period: number;
  amount: number;
  tokens: number;
}

export interface WaterfallProps {
  period: number;
  amount: number;
  tokens: number;
  amountBefore: number;
  tokensBefore: number;
}

const timeMap: { [key: string]: string } = {
  day: 'today',
  week: 'this week',
  month: 'this month',
};

export const FlowBox = () => {
  const { width } = useSize();
  const [isTime, setIsTime] = useState<string>('month');
  const [isType, setIsType] = useState<string>('amount');

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };
  const { data, loading } = useQuery(GET_IN_OUT, {
    variables: { time: isTime, auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  const buttonProps = {
    isTime,
    isType,
    // isGraph,
    setIsTime,
    setIsType,
    // setIsGraph,
  };

  if (!data || loading) {
    return <LoadingCard title={'Invoices and Payments Report'} />;
  }

  const parsedData: PeriodProps[] = JSON.parse(data.getInOut.invoices);
  const parsedData2: PeriodProps[] = JSON.parse(data.getInOut.payments);

  // const waterfall: WaterfallProps[] = getWaterfall(parsedData, parsedData2);

  if (parsedData.length <= 0 && parsedData2.length <= 0) {
    return (
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Invoices and Payments Report</SubTitle>
          <ButtonRow {...buttonProps} />
        </CardTitle>
        <Card
          bottom={'10px'}
          cardPadding={width <= mediaDimensions.mobile ? '8px 0' : undefined}
        >
          <p>{`Your node has not forwarded any payments ${timeMap[isTime]}.`}</p>
        </Card>
      </CardWithTitle>
    );
  }

  const reduce = (array: PeriodProps[]) =>
    array.reduce((p, c) => {
      return {
        tokens: p.tokens + c.tokens,
        period: 0,
        amount: p.amount + c.amount,
      };
    });

  const emptyArray = {
    tokens: 0,
    period: 0,
    amount: 0,
  };

  const totalInvoices: any =
    parsedData.length > 0 ? reduce(parsedData) : emptyArray;
  const totalPayments: any =
    parsedData2.length > 0 ? reduce(parsedData2) : emptyArray;

  const flowPie = [
    { x: 'Invoice', y: totalInvoices[isType] },
    { x: 'Payments', y: totalPayments[isType] },
  ];

  const invoicePie = [
    { x: 'Confirmed', y: data.getInOut.confirmedInvoices },
    { x: 'Unconfirmed', y: data.getInOut.unConfirmedInvoices },
  ];

  const props = {
    isTime,
    isType,
    parsedData,
    parsedData2,
  };
  const pieProps = { invoicePie };
  const flowProps = { flowPie, isType };

  return (
    <>
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Invoices and Payments Report</SubTitle>
          <ButtonRow {...buttonProps} />
        </CardTitle>
        <Card
          bottom={'10px'}
          cardPadding={width <= mediaDimensions.mobile ? '8px 0' : undefined}
        >
          <FlowReport {...props} />
        </Card>
      </CardWithTitle>
      <Row noWrap={true}>
        <HalfCardWithTitle>
          <CardTitle>
            <Sub4Title>Total</Sub4Title>
          </CardTitle>
          <Card
            cardPadding={width <= mediaDimensions.mobile ? '8px' : undefined}
          >
            <FlowPie {...flowProps} />
          </Card>
        </HalfCardWithTitle>
        <div style={{ width: '20px' }} />
        <HalfCardWithTitle>
          <CardTitle>
            <Sub4Title>Invoices</Sub4Title>
          </CardTitle>
          <Card
            cardPadding={width <= mediaDimensions.mobile ? '8px' : undefined}
          >
            <InvoicePie {...pieProps} />
          </Card>
        </HalfCardWithTitle>
      </Row>
    </>
  );
};
