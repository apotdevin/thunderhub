import { useMemo, useState } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { useChartColors } from '../../../../lib/chart-colors';
import { getByTime } from '../helpers';
import { useGetInvoicesQuery } from '../../../../graphql/queries/__generated__/getInvoices.generated';
import { differenceInDays } from 'date-fns';
import { BarChart } from '../../../../components/chart/BarChart';

const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Amount', value: 'tokens' },
];

export const InvoicesGraph = () => {
  const chartColors = useChartColors();
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetInvoicesQuery({
    errorPolicy: 'ignore',
  });

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

  const Header = () => (
    <div className="grid" style={{ gridTemplateColumns: '1fr 90px' }}>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground my-1 block">
        Invoices
      </span>
      <SmallSelectWithValue
        callback={e => setType((e[0] || typeOptions[1]) as any)}
        options={typeOptions}
        value={type}
        isClearable={false}
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

  if (!invoicesByDate.length) {
    return (
      <div className="w-full h-full">
        <Header />
        <div className="w-full h-full flex justify-center items-center">
          No invoices for this period.
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
          data={invoicesByDate.map(f => {
            return {
              Invoices: f?.[type.value] || 0,
              date: f.date,
            };
          })}
          dataKey="Invoices"
          title="Invoices"
          colorRange={[chartColors.orange2]}
        />
      </div>
    </div>
  );
};
