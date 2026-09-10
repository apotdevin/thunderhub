import { FC, useMemo } from 'react';
import { Price } from '../../../../components/price/Price';
import { useGetForwardsSummaryQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';

type TypeOptionProps = {
  label: string;
  value: string;
};

type ForwardResumeProps = {
  type: TypeOptionProps;
};

export const ForwardResume: FC<ForwardResumeProps> = ({ type }) => {
  const { data, loading } = useGetForwardsSummaryQuery({
    variables: { days: 365 },
    errorPolicy: 'ignore',
  });

  const values = useMemo(() => {
    const summary = data?.getForwards.summary;
    if (!summary) return { day: 0, week: 0, month: 0, year: 0 };

    if (type.value === 'fee') {
      return {
        day: Number.parseInt(summary.day.fee_mtokens) || 0,
        week: Number.parseInt(summary.week.fee_mtokens) || 0,
        month: Number.parseInt(summary.month.fee_mtokens) || 0,
        year: Number.parseInt(summary.year.fee_mtokens) || 0,
      };
    }

    if (type.value === 'tokens') {
      return {
        day: summary.day.tokens,
        week: summary.week.tokens,
        month: summary.month.tokens,
        year: summary.year.tokens,
      };
    }

    return {
      day: summary.day.count,
      week: summary.week.count,
      month: summary.month.count,
      year: summary.year.count,
    };
  }, [data, type]);

  if (loading) return null;

  const renderValue = (value: number) => {
    if (type.value === 'count') {
      return <span className="text-sm font-medium font-mono">{value}</span>;
    }
    if (type.value === 'fee') {
      return (
        <span className="text-sm font-medium font-mono">
          <Price amount={Math.floor(value / 1000)} />
        </span>
      );
    }
    return (
      <span className="text-sm font-medium font-mono">
        <Price amount={value} />
      </span>
    );
  };

  const items = [
    { label: 'Day', value: values.day },
    { label: 'Week', value: values.week },
    { label: 'Month', value: values.month },
    { label: 'Year', value: values.year },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(item => (
        <div key={item.label} className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-muted-foreground">{item.label}</span>
          {renderValue(item.value)}
        </div>
      ))}
    </div>
  );
};
