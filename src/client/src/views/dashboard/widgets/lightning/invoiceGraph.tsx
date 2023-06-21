import { useMemo, useState } from 'react';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { SmallSelectWithValue } from '../../../../components/select';
import { chartColors } from '../../../../styles/Themes';
import styled from 'styled-components';
import { getByTime } from '../helpers';
import { useGetInvoicesQuery } from '../../../../graphql/queries/__generated__/getInvoices.generated';
import { differenceInDays } from 'date-fns';
import { BarChartV2 } from '../../../../components/chart/BarChartV2';

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

export const InvoicesGraph = () => {
  const [type, setType] = useState(typeOptions[0]);

  const { data, loading } = useGetInvoicesQuery({
    errorPolicy: 'ignore',
  });

  const invoicesByDate = useMemo(() => {
    const invoices = data?.getInvoices.invoices || [];
    const filtered = invoices.filter(i => !!i.is_confirmed);

    if (!filtered.length) {
      return [];
    }

    const lastInvoice = filtered[filtered.length - 1];

    const difference = differenceInDays(
      new Date(),
      new Date(lastInvoice.confirmed_at || '')
    );

    const invoicesByDate = getByTime(filtered, difference);

    return invoicesByDate;
  }, [data]);

  const Header = () => (
    <S.row>
      <S.title>Invoices</S.title>
      <SmallSelectWithValue
        callback={e => setType((e[0] || typeOptions[1]) as any)}
        options={typeOptions}
        value={type}
        isClearable={false}
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

  if (!invoicesByDate.length) {
    return (
      <S.wrapper>
        <Header />
        <S.contentWrapper>No invoices for this period.</S.contentWrapper>
      </S.wrapper>
    );
  }

  return (
    <S.wrapper>
      <Header />
      <S.content>
        <BarChartV2
          data={invoicesByDate.map(f => {
            return {
              Invoices: f?.[type.value] || 0,
              date: f.date,
            };
          })}
          dataKey="Invoices"
          title="Invoices"
          colorRange={[chartColors.orange2]}
        />
      </S.content>
    </S.wrapper>
  );
};
