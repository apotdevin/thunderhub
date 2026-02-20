import { FC } from 'react';
import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { chartColors } from '../../../../styles/Themes';
import { getByTime } from '../../../../views/dashboard/widgets/helpers';
import styled from 'styled-components';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 320px;
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
      <S.wrapper>
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!data?.getForwards.list.length) {
    return (
      <S.wrapper>
        <S.contentWrapper>No forwards for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  const forwards = getByTime(data.getForwards.list, days.value);

  return (
    <S.wrapper>
      <S.content>
        <BarChart
          title="Forwards"
          data={forwards.map(f => ({
            Forward: f[type.value] || 0,
            date: f.date,
          }))}
          colorRange={[chartColors.purple]}
          dataKey="Forward"
        />
      </S.content>
    </S.wrapper>
  );
};
