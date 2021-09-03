import { useMemo, useState } from 'react';

import { BarChart } from 'src/components/chart/BarChart';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { SmallSelectWithValue } from 'src/components/select';
import { useGetResumeQuery } from 'src/graphql/queries/__generated__/getResume.generated';
import { InvoiceType, PaymentType } from 'src/graphql/types';
import { chartColors } from 'src/styles/Themes';
import styled from 'styled-components';
import { getByTime } from '../helpers';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 100%;
  `,
  contentWrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  content: styled.div`
    width: 100%;
    padding: 0 16px;
    height: calc(100% - 40px);
    overflow: auto;
  `,
  title: styled.h4`
    font-weight: 900;
    margin: 8px 0;
  `,
  nowrap: styled.div`
    white-space: nowrap;
  `,
};

const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
];

const typeOptions = [
  { label: 'Count', value: 'amount' },
  { label: 'Amount', value: 'tokens' },
];

export const TransactionsGraph = () => {
  const [days, setDays] = useState(options[1]);
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetResumeQuery({
    variables: { limit: days.value },
    errorPolicy: 'ignore',
  });

  const resume = data?.getResume.resume || [];

  const { invoicesByDate, paymentsByDate } = useMemo(() => {
    const invoices: InvoiceType[] = [];
    const payments: PaymentType[] = [];

    resume.forEach(t => {
      if (!t) return;
      if (t.__typename === 'InvoiceType') {
        if (!t.is_confirmed) return;
        invoices.push(t);
      }
      if (t.__typename === 'PaymentType') {
        if (!t.is_confirmed) return;
        payments.push(t);
      }
    });

    const invoicesByDate = getByTime(invoices, days.value);
    const paymentsByDate = getByTime(payments, days.value);

    return { invoicesByDate, paymentsByDate };
  }, [resume]);

  const Header = () => (
    <S.row>
      <S.title>Transactions</S.title>
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
  );

  if (loading) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!resume.length) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>No transactions for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  return (
    <S.wrapper>
      <Header />
      <S.content>
        <BarChart
          priceLabel={type.value !== 'amount'}
          data={invoicesByDate.map(f => {
            const payment = paymentsByDate.find(p => p.date === f.date);
            return {
              Invoices: f?.[type.value] || 0,
              Payments: payment?.[type.value] || 0,
              date: f.date,
            };
          })}
          colorRange={[chartColors.orange2, chartColors.darkyellow]}
        />
      </S.content>
    </S.wrapper>
  );
};
