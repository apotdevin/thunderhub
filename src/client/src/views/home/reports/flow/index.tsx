import React, { useState } from 'react';
import styled from 'styled-components';
import { SmallSelectWithValue } from '../../../../components/select';
import { mediaWidths } from '../../../../styles/Themes';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
} from '../../../../components/generic/Styled';
import { TransactionsGraph } from './TransactionGraph';

const S = {
  row: styled.div`
    width: 100%;
    display: grid;
    column-gap: 16px;
    grid-template-columns: 1fr 110px 110px;
    margin-bottom: 8px;
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
  { label: 'Invoices', value: 'invoices' },
  { label: 'Payments', value: 'payments' },
];

const typeOptions = [
  { label: 'Count', value: 'amount' },
  { label: 'Volume', value: 'tokens' },
];

export const FlowBox = () => {
  const [show, setShow] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);

  const Header = () => {
    return (
      <CardTitle>
        <S.row>
          <SubTitle>Transactions</SubTitle>
          <SmallSelectWithValue
            callback={e => setShow((e[0] || options[1]) as any)}
            options={options}
            value={show}
            isClearable={false}
          />
          <SmallSelectWithValue
            callback={e => setType((e[0] || typeOptions[1]) as any)}
            options={typeOptions}
            value={type}
            isClearable={false}
          />
        </S.row>
      </CardTitle>
    );
  };

  return (
    <CardWithTitle>
      <Header />
      <Card bottom={'10px'} mobileCardPadding={'8px 0'}>
        <TransactionsGraph
          showPay={show.value === 'payments'}
          type={type.value}
        />
      </Card>
    </CardWithTitle>
  );
};
