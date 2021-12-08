import { useMemo, useState } from 'react';

import { BarChart } from '../../../../components/chart/BarChart';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { useGetResumeQuery } from '../../../../graphql/queries/__generated__/getResume.generated';
import { PaymentType } from '../../../../graphql/types';
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
];

const typeOptions = [
  { label: 'Count', value: 'amount' },
  { label: 'Amount', value: 'tokens' },
];

export const PaymentsGraph = () => {
  const [days, setDays] = useState(options[1]);
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetResumeQuery({
    variables: { limit: days.value },
    errorPolicy: 'ignore',
  });

  const resume = data?.getResume.resume || [];

  const paymentsByDate = useMemo(() => {
    const payments = resume.reduce((p, c) => {
      if (!c) return p;
      if (c.__typename === 'PaymentType') {
        if (!c.is_confirmed) return p;
        return [...p, c];
      }
      return p;
    }, [] as PaymentType[]);

    return getByTime(payments, days.value);
  }, [resume]);

  const Header = () => (
    <S.row>
      <S.title>Payments</S.title>
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

  if (!resume.length) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>No payments for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  return (
    <S.wrapper>
      <Header />
      <S.content>
        <BarChart
          priceLabel={type.value !== 'amount'}
          data={paymentsByDate.map(f => {
            return {
              Payments: f?.[type.value] || 0,
              date: f.date,
            };
          })}
          colorRange={[chartColors.darkyellow]}
        />
      </S.content>
    </S.wrapper>
  );
};
