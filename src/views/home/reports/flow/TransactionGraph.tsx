import { FC, useMemo } from 'react';
import { BarChart } from 'src/components/chart/BarChart';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useGetResumeQuery } from 'src/graphql/queries/__generated__/getResume.generated';
import { InvoiceType, PaymentType } from 'src/graphql/types';
import { chartColors } from 'src/styles/Themes';
import { getByTime } from 'src/views/dashboard/widgets/helpers';
import styled from 'styled-components';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 300px;
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

type TransactionsGraphProps = {
  days: number;
  type: string;
};

export const TransactionsGraph: FC<TransactionsGraphProps> = ({
  days,
  type,
}) => {
  const { data, loading } = useGetResumeQuery({
    variables: { limit: days },
    errorPolicy: 'ignore',
  });

  const { invoicesByDate, paymentsByDate } = useMemo(() => {
    const resume = data?.getResume.resume || [];
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

    const invoicesByDate = getByTime(invoices, days);
    const paymentsByDate = getByTime(payments, days);

    return { invoicesByDate, paymentsByDate };
  }, [data, days]);

  if (loading) {
    return (
      <S.wrapper>
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!data?.getResume.resume.length) {
    return (
      <S.wrapper>
        <S.contentWrapper>No transactions for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  return (
    <S.wrapper>
      <S.content>
        <BarChart
          priceLabel={type !== 'amount'}
          data={invoicesByDate.map(f => {
            const payment = paymentsByDate.find(p => p.date === f.date);
            return {
              Invoices: f?.[type] || 0,
              Payments: payment?.[type] || 0,
              date: f.date,
            };
          })}
          colorRange={[chartColors.orange2, chartColors.darkyellow]}
        />
      </S.content>
    </S.wrapper>
  );
};
