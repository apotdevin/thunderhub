import { useMemo, useState } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { chartColors } from '../../../../styles/Themes';
import styled from 'styled-components';
import { getByTime } from '../helpers';
import { useGetPaymentsQuery } from '../../../../graphql/queries/__generated__/getPayments.generated';
import { differenceInDays } from 'date-fns';
import { BarChart } from '../../../../components/chart/BarChart';

const S = {
  row: styled.div`
    display: grid;
    grid-template-columns: 1fr 90px;
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

const typeOptions = [
  { label: 'Count', value: 'amount' },
  { label: 'Amount', value: 'tokens' },
];

export const PaymentsGraph = () => {
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetPaymentsQuery();

  const paymentsByDate = useMemo(() => {
    const payments = data?.getPayments.payments || [];
    const filtered = payments.filter(i => !!i.is_confirmed);

    if (!filtered.length) {
      return [];
    }

    const lastPayment = filtered[filtered.length - 1];

    const difference = differenceInDays(
      new Date(),
      new Date(lastPayment.created_at || '')
    );

    const paymentsByDate = getByTime(filtered, difference);

    return paymentsByDate;
  }, [data]);

  const Header = () => (
    <S.row>
      <S.title>Payments</S.title>
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

  if (!paymentsByDate.length) {
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
          data={paymentsByDate.map(f => {
            return {
              Payments: f?.[type.value] || 0,
              date: f.date,
            };
          })}
          colorRange={[chartColors.darkyellow]}
          title="Payments"
          dataKey="Payments"
        />
      </S.content>
    </S.wrapper>
  );
};
