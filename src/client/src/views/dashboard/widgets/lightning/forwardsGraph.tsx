import { useState } from 'react';
import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { chartColors } from '../../../../styles/Themes';
import styled from 'styled-components';
import { getByTime } from '../helpers';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 100%;
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

const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
  { label: '6M', value: 180 },
  { label: '1Y', value: 360 },
];

const typeOptions = [
  { label: 'Count', value: 'amount' },
  { label: 'Amount', value: 'tokens' },
  { label: 'Fees', value: 'fee' },
];

export const ForwardsGraph = () => {
  const [days, setDays] = useState(options[1]);
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days: days.value },
    errorPolicy: 'ignore',
  });

  const Header = () => (
    <S.row>
      <S.title>Forwards</S.title>
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
    </S.row>
  );

  if (loading) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>
          <LoadingCard noCard={true} />
        </S.contentWrapper>
      </S.wrapper>
    );
  }

  if (!data?.getForwards.length) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>No forwards for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  const forwards = getByTime(data.getForwards, days.value);

  return (
    <S.wrapper>
      <Header />
      <S.content>
        <BarChart
          priceLabel={type.value !== 'amount'}
          data={forwards.map(f => ({
            Forward: f[type.value] || 0,
            date: f.date,
          }))}
          colorRange={[chartColors.purple]}
        />
      </S.content>
    </S.wrapper>
  );
};
