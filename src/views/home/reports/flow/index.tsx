import React, { useState } from 'react';
import styled from 'styled-components';
import { SmallSelectWithValue } from 'src/components/select';
import { useGetResumeQuery } from 'src/graphql/queries/__generated__/getResume.generated';
import { renderLine } from 'src/components/generic/helpers';
import { Price } from 'src/components/price/Price';
import { mediaWidths } from 'src/styles/Themes';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
  Sub4Title,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { TransactionsGraph } from './TransactionGraph';

const S = {
  row: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  grid: styled.div`
    width: 100%;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr;
    }
  `,
};

export interface PeriodProps {
  period: number;
  amount: number;
  tokens: number;
}

const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
];

const typeOptions = [
  { label: 'Amount', value: 'amount' },
  { label: 'Tokens', value: 'tokens' },
];

export const FlowBox = () => {
  const [days, setDays] = useState(options[2]);
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetResumeQuery({
    variables: { limit: days.value },
    errorPolicy: 'ignore',
  });

  const transactions = data?.getResume.resume || [];

  if (!data || loading) {
    return <LoadingCard title={'Transactions'} />;
  }

  const reduced = transactions.reduce(
    (p, c) => {
      if (!c) return p;
      if (c.__typename === 'InvoiceType') {
        if (c.is_confirmed) {
          return {
            ...p,
            invoices: p.invoices + 1,
            invoiceAmount: p.invoiceAmount + c.received,
            confirmed: p.confirmed + 1,
          };
        }
        return {
          ...p,
          invoices: p.invoices + 1,
          unconfirmed: p.unconfirmed + 1,
        };
      }
      if (c.__typename === 'PaymentType') {
        return {
          ...p,
          payments: p.payments + 1,
          paymentAmount: p.paymentAmount + (Number(c.tokens) || 0),
        };
      }
      return p;
    },
    {
      invoices: 0,
      invoiceAmount: 0,
      payments: 0,
      paymentAmount: 0,
      confirmed: 0,
      unconfirmed: 0,
    }
  );

  const Header = () => {
    return (
      <CardTitle>
        <S.row>
          <SubTitle>Transactions</SubTitle>
          <SmallSelectWithValue
            callback={e => setDays((e[0] || options[1]) as any)}
            options={options}
            value={days}
            isClearable={false}
            maxWidth={'60px'}
          />
          <SmallSelectWithValue
            callback={e => setType((e[0] || typeOptions[1]) as any)}
            options={typeOptions}
            value={type}
            isClearable={false}
            maxWidth={'90px'}
          />
        </S.row>
      </CardTitle>
    );
  };

  return (
    <>
      <CardWithTitle>
        <Header />
        <Card bottom={'10px'} mobileCardPadding={'8px 0'}>
          <TransactionsGraph days={days.value} type={type.value} />
        </Card>
      </CardWithTitle>
      {transactions.length ? (
        <S.grid>
          <CardWithTitle>
            <Sub4Title>Total</Sub4Title>
            <Card>
              {renderLine(
                'Invoices',
                type.value === 'amount' ? (
                  <Price amount={reduced.invoiceAmount} />
                ) : (
                  reduced.invoices
                )
              )}
              {renderLine(
                'Payments',
                type.value === 'amount' ? (
                  <Price amount={reduced.paymentAmount} />
                ) : (
                  reduced.payments
                )
              )}
            </Card>
          </CardWithTitle>
          <CardWithTitle>
            <Sub4Title>Invoices</Sub4Title>
            <Card>
              {renderLine('Confirmed', reduced.confirmed)}
              {renderLine('Unconfirmed', reduced.unconfirmed)}
            </Card>
          </CardWithTitle>
        </S.grid>
      ) : null}
    </>
  );
};
