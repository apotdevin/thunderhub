import { FC } from 'react';
import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetForwardsGraphQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { useChartColors } from '../../../../lib/chart-colors';

type DayOptionProps = {
  label: string;
  value: number;
};

type TypeOptionProps = {
  label: string;
  value: string;
};

type ForwardGraphProps = {
  days: DayOptionProps;
  type: TypeOptionProps;
};

export const ForwardsGraph: FC<ForwardGraphProps> = ({ days, type }) => {
  const chartColors = useChartColors();
  const { data, loading } = useGetForwardsGraphQuery({
    variables: { days: days.value },
    errorPolicy: 'ignore',
  });

  if (loading) {
    return (
      <div className="w-full h-80">
        <div className="w-full h-full flex justify-center items-center">
          <LoadingCard noCard={true} />
        </div>
      </div>
    );
  }

  if (!data?.getForwards?.summary?.count) {
    return (
      <div className="w-full h-80">
        <div className="w-full h-full flex justify-center items-center">
          No forwards for this period.
        </div>
      </div>
    );
  }

  const timeSeries = data.getForwards.by_time || [];

  return (
    <div className="w-full h-80">
      <div className="w-full px-4 h-[calc(100%-40px)] overflow-auto">
        <BarChart
          title="Forwards"
          data={timeSeries.map((f: any) => ({
            Forward: f[type.value] || 0,
            date: f.date,
          }))}
          colorRange={[chartColors.purple]}
          dataKey="Forward"
        />
      </div>
    </div>
  );
};
