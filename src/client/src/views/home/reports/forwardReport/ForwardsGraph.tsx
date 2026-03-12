import { FC } from 'react';
import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { chartColors } from '../../../../styles/Themes';
import { getByTime } from '../../../../views/dashboard/widgets/helpers';

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
  const { data, loading } = useGetForwardsQuery({
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

  if (!data?.getForwards.list.length) {
    return (
      <div className="w-full h-80">
        <div className="w-full h-full flex justify-center items-center">
          No forwards for this period.
        </div>
      </div>
    );
  }

  const forwards = getByTime(data.getForwards.list, days.value);

  return (
    <div className="w-full h-80">
      <div className="w-full px-4 h-[calc(100%-40px)] overflow-auto">
        <BarChart
          title="Forwards"
          data={forwards.map(f => ({
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
