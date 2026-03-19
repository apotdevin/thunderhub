import { FC, useMemo } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useChartColors } from '../../../../lib/chart-colors';
import { getByTime } from '../../../../views/dashboard/widgets/helpers';
import { useGetInvoicesQuery } from '../../../../graphql/queries/__generated__/getInvoices.generated';
import { differenceInDays } from 'date-fns';
import { useGetPaymentsQuery } from '../../../../graphql/queries/__generated__/getPayments.generated';
import { BarChart } from '../../../../components/chart/BarChart';

type TransactionsGraphProps = {
  showPay: boolean;
  type: string;
};

export const TransactionsGraph: FC<TransactionsGraphProps> = ({
  showPay,
  type,
}) => {
  const chartColors = useChartColors();
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
  }, [invoiceData]);

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
      <div className="w-full h-[300px]">
        <div className="flex h-full w-full items-center justify-center">
          <LoadingCard noCard={true} />
        </div>
      </div>
    );
  }

  if (
    (!showPay && !invoiceData?.getInvoices.invoices.length) ||
    (showPay && !paymentsData?.getPayments.payments.length)
  ) {
    return (
      <div className="w-full h-[300px]">
        <div className="flex h-full w-full items-center justify-center">
          No {showPay ? 'payments' : 'invoices'} for this period.
        </div>
      </div>
    );
  }

  const finalArray = showPay ? paymentsByDate : invoicesByDate;
  const finalColor = showPay ? [chartColors.darkyellow] : [chartColors.orange2];

  return (
    <div className="w-full h-[300px]">
      <div
        className="w-full px-4 overflow-auto"
        style={{ height: 'calc(100% - 40px)' }}
      >
        <BarChart
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
      </div>
    </div>
  );
};
