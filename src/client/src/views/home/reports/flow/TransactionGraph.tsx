import { FC, useMemo } from 'react';
import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { chartColors } from '../../../../styles/Themes';
import { getByTime } from '../../../../views/dashboard/widgets/helpers';
import styled from 'styled-components';
import { useGetInvoicesQuery } from '../../../../graphql/queries/__generated__/getInvoices.generated';
import { differenceInDays } from 'date-fns';
import { useGetPaymentsQuery } from '../../../../graphql/queries/__generated__/getPayments.generated';

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
  showPay: boolean;
  type: string;
};

export const TransactionsGraph: FC<TransactionsGraphProps> = ({
  showPay,
  type,
}) => {
  const { data, loading } = useGetInvoicesQuery();
  const { data: paymentsData, loading: paymentsLoading } =
    useGetPaymentsQuery();

  const invoicesByDate = useMemo(() => {
    const invoices = data?.getInvoices.invoices || [];
    const filtered = invoices.filter(i => !!i.is_confirmed);

    if (!filtered.length) {
      return [];
    }

    const lastInvoice = filtered[filtered.length - 1];

    const difference = differenceInDays(
      new Date(),
      new Date(lastInvoice.confirmed_at || '')
    );

    const invoicesByDate = getByTime(filtered, difference);

    return invoicesByDate;
  }, [data]);

  const paymentsByDate = useMemo(() => {
    const payments = paymentsData?.getPayments.payments || [];
    const filtered = payments.filter(i => !!i.is_confirmed);

    if (!filtered.length) {
      return [];
    }

    const lastPayment = filtered[filtered.length - 1];

    const difference = differenceInDays(
      new Date(),
      new Date(lastPayment.created_at || '')
    );

    const paymentsByDate = getByTime(filtered, difference);

    return paymentsByDate;
  }, [paymentsData]);

  if (loading || paymentsLoading) {
    return (
      <S.wrapper>
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!data?.getInvoices.invoices.length) {
    return (
      <S.wrapper>
        <S.contentWrapper>No transactions for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  const finalArray = showPay ? paymentsByDate : invoicesByDate;
  const finalColor = showPay ? [chartColors.darkyellow] : [chartColors.orange2];

  return (
    <S.wrapper>
      <S.content>
        <BarChart
          priceLabel={type !== 'amount'}
          data={finalArray.map(f => {
            return {
              [showPay ? 'Payments' : 'Invoices']: f?.[type] || 0,
              date: f.date,
            };
          })}
          colorRange={finalColor}
        />
      </S.content>
    </S.wrapper>
  );
};
