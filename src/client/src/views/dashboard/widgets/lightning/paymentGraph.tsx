import { useMemo, useState } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { chartColors } from '../../../../styles/Themes';
import { getByTime } from '../helpers';
import { useGetPaymentsQuery } from '../../../../graphql/queries/__generated__/getPayments.generated';
import { differenceInDays } from 'date-fns';
import { BarChart } from '../../../../components/chart/BarChart';

const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Amount', value: 'tokens' },
];

export const PaymentsGraph = () => {
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetPaymentsQuery();

  const paymentsByDate = useMemo(() => {
    const payments = data?.getPayments.payments || [];
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
  }, [data]);

  const Header = () => (
    <div className="grid" style={{ gridTemplateColumns: '1fr 90px' }}>
      <h4 className="font-black my-2">Payments</h4>
      <SmallSelectWithValue
        callback={e => setType((e[0] || typeOptions[1]) as any)}
        options={typeOptions}
        value={type}
        isClearable={false}
        maxWidth={'90px'}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-full">
        <Header />
        <div className="w-full h-full flex justify-center items-center">
          <LoadingCard noCard={true} />
        </div>
      </div>
    );
  }

  if (!paymentsByDate.length) {
    return (
      <div className="w-full h-full">
        <Header />
        <div className="w-full h-full flex justify-center items-center">
          No payments for this period.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Header />
      <div
        className="w-full px-4 overflow-auto"
        style={{ height: 'calc(100% - 40px)' }}
      >
        <BarChart
          data={paymentsByDate.map(f => {
            return {
              Payments: f?.[type.value] || 0,
              date: f.date,
            };
          })}
          colorRange={[chartColors.darkyellow]}
          title="Payments"
          dataKey="Payments"
        />
      </div>
    </div>
  );
};
