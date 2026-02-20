import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { differenceInDays } from 'date-fns';
import { Price } from '../../../../components/price/Price';
import { mediaWidths } from '../../../../styles/Themes';
import { DarkSubTitle } from '../../../../components/generic/Styled';
import { useGetForwardsListQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';

type ArrayType = { fee: number; fee_mtokens: string; tokens: number };

const S = {
  grid: styled.div`
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr 1fr 1fr;

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
  const { data, loading } = useGetForwardsListQuery({
    variables: { days: 365 },
    errorPolicy: 'ignore',
  });

  const values = useMemo(() => {
    const day: ArrayType[] = [];
    const week: ArrayType[] = [];
    const month: ArrayType[] = [];

    const forwards = data?.getForwards.list || [];

    if (!forwards.length) return { day: 0, week: 0, month: 0, year: 0 };

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
      if (differenceInDays(today, forwardDate) < 30) {
        month.push(f);
      }
    });

    const dayValue = day.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + Number.parseInt(c.fee_mtokens);
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);
    const weekValue = week.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + Number.parseInt(c.fee_mtokens);
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);
    const monthValue = month.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + Number.parseInt(c.fee_mtokens);
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);
    const yearValue = forwards.reduce((p, c) => {
      if (!c) return p;
      if (type.value === 'fee') {
        return p + Number.parseInt(c.fee_mtokens);
      }
      if (type.value === 'tokens') {
        return p + c.tokens;
      }
      return p + 1;
    }, 0);

    return {
      day: dayValue,
      week: weekValue,
      month: monthValue,
      year: yearValue,
    };
  }, [data, type]);

  if (loading) {
    return null;
  }

  const renderValue = (value: number) => {
    if (type.value === 'count') {
      return <div>{value}</div>;
    } else if (type.value === 'fee') {
      return <Price amount={Math.floor(value / 1000)} />;
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
      <S.item>
        <DarkSubTitle>Year</DarkSubTitle>
        {renderValue(values.year)}
      </S.item>
    </S.grid>
  );
};
