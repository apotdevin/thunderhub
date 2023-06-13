import { FC, useMemo } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { chartColors } from '../../../../styles/Themes';
import { getByTime } from '../../../../views/dashboard/widgets/helpers';
import styled from 'styled-components';
import { useGetInvoicesQuery } from '../../../../graphql/queries/__generated__/getInvoices.generated';
import { differenceInDays } from 'date-fns';
import { useGetPaymentsQuery } from '../../../../graphql/queries/__generated__/getPayments.generated';
import { BarChartV2 } from '../../../../components/chart/BarChartV2';

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
  const { data: invoiceData, loading } = useGetInvoicesQuery();
  const { data: paymentsData, loading: paymentsLoading } =
    useGetPaymentsQuery();

  const labels = useMemo(() => {
    switch (type) {
      case 'amount':
        return {
          yAxisLabel: `Amount of ${showPay ? 'Payments' : 'Invoices'}`,
          title: `Amount of ${showPay ? 'Payments' : 'Invoices'}`,
        };
      case 'tokens':
        return {
          yAxisLabel: `${showPay ? 'Payments' : 'Invoices'} Volume (sats)`,
          title: `${showPay ? 'Payments' : 'Invoices'} Volume (sats)`,
        };
      default:
        return {};
    }
  }, [type, showPay]);

  const invoicesByDate = useMemo(() => {
    const invoices = invoiceData?.getInvoices.invoices || [];
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
  }, [invoiceData, showPay]);

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
  }, [paymentsData, showPay]);

  if (loading || paymentsLoading) {
    return (
      <S.wrapper>
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (
    (!showPay && !invoiceData?.getInvoices.invoices.length) ||
    (showPay && !paymentsData?.getPayments.payments.length)
  ) {
    return (
      <S.wrapper>
        <S.contentWrapper>
          No {showPay ? 'payments' : 'invoices'} for this period.
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  const finalArray = showPay ? paymentsByDate : invoicesByDate;
  const finalColor = showPay ? [chartColors.darkyellow] : [chartColors.orange2];

  return (
    <S.wrapper>
      <S.content>
        <BarChartV2
          data={finalArray.map(f => {
            return {
              [showPay ? 'Payments' : 'Invoices']: f?.[type] || 0,
              date: f.date,
            };
          })}
          colorRange={finalColor}
          title={labels.title || ''}
          dataKey={showPay ? 'Payments' : 'Invoices'}
        />
      </S.content>
    </S.wrapper>
  );
};
