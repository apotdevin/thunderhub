import { useState } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { useChartColors } from '../../../../lib/chart-colors';
import { getByTime } from '../helpers';
import { BarChart } from '../../../../components/chart/BarChart';

const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
  { label: '6M', value: 180 },
  { label: '1Y', value: 360 },
];

const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Amount', value: 'tokens' },
  { label: 'Fees', value: 'fee' },
];

export const ForwardsGraph = () => {
  const chartColors = useChartColors();
  const [days, setDays] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetForwardsQuery({
    variables: { days: days.value },
    errorPolicy: 'ignore',
  });

  const Header = () => (
    <div className="grid" style={{ gridTemplateColumns: '1fr 60px 90px' }}>
      <h4 className="font-black my-2">Forwards</h4>
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

  if (!data?.getForwards.list.length) {
    return (
      <div className="w-full h-full">
        <Header />
        <div className="w-full h-full flex justify-center items-center">
          No forwards for this period.
        </div>
      </div>
    );
  }

  const forwards = getByTime(data.getForwards.list, days.value);

  return (
    <div className="w-full h-full">
      <Header />
      <div
        className="w-full px-4 overflow-auto"
        style={{ height: 'calc(100% - 40px)' }}
      >
        <BarChart
          data={forwards.map(f => ({
            Forward: f[type.value] || 0,
            date: f.date,
          }))}
          dataKey="Forward"
          title="Forwards Report"
          colorRange={[chartColors.purple]}
        />
      </div>
    </div>
  );
};
