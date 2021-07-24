import { FC, useMemo } from 'react';
import { useGetForwardsQuery } from 'src/graphql/queries/__generated__/getForwards.generated';
import styled from 'styled-components';
import { differenceInDays } from 'date-fns';
import { Price } from 'src/components/price/Price';
import { mediaWidths } from 'src/styles/Themes';
import { DarkSubTitle } from 'src/components/generic/Styled';

type ArrayType = { fee: number; tokens: number };

const S = {
  grid: styled.div`
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr 1fr;

    @media (${mediaWidths.mobile}) {
      display: block;
    }
  `,
  item: styled.div`
    text-align: center;

    @media (${mediaWidths.mobile}) {
      margin: 8px 0;
    }
  `,
};

type TypeOptionProps = {
  label: string;
  value: string;
};

type ForwardResumeProps = {
  type: TypeOptionProps;
};

export const ForwardResume: FC<ForwardResumeProps> = ({ type }) => {
  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days: 30 },
    errorPolicy: 'ignore',
  });

  const values = useMemo(() => {
    const day: ArrayType[] = [];
    const week: ArrayType[] = [];

    const forwards = data?.getForwards || [];

    if (!forwards.length) return { day: 0, week: 0, month: 0 };

    const today = new Date();

    forwards.forEach(f => {
      if (!f) return;
      const forwardDate = new Date(f.created_at);

      if (differenceInDays(today, forwardDate) < 1) {
        day.push(f);
      }
      if (differenceInDays(today, forwardDate) < 7) {
        week.push(f);
      }
    });

    const dayValue = day.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + c.fee;
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);
    const weekValue = week.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + c.fee;
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);
    const monthValue = forwards.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + c.fee;
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);

    return { day: dayValue, week: weekValue, month: monthValue };
  }, [data, type]);

  if (loading) {
    return null;
  }

  const renderValue = (value: number) => {
    if (type.value === 'amount') {
      return <div>{value}</div>;
    }
    return <Price amount={value} />;
  };

  return (
    <S.grid>
      <S.item>
        <DarkSubTitle>Day</DarkSubTitle>
        {renderValue(values.day)}
      </S.item>
      <S.item>
        <DarkSubTitle>Week</DarkSubTitle>
        {renderValue(values.week)}
      </S.item>
      <S.item>
        <DarkSubTitle>Month</DarkSubTitle>
        {renderValue(values.month)}
      </S.item>
    </S.grid>
  );
};
