import { ArrowDown, ArrowUp } from 'react-feather';
import { getDateDif, shorten } from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';
import { Table } from '../../../../components/table';
import { useGetResumeQuery } from '../../../../graphql/queries/__generated__/getResume.generated';
import { chartColors } from '../../../../styles/Themes';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    width: 100%;
    height: 100%;
  `,
  table: styled.div`
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
  `,
  title: styled.h4`
    font-weight: 900;
    width: 100%;
    text-align: center;
    margin: 8px 0;
  `,
  nowrap: styled.div`
    white-space: nowrap;
  `,
};

export const TransactionsWidget = () => {
  const { data } = useGetResumeQuery();
  const transactions = data?.getResume.resume || [];

  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Amount', accessor: 'value' },
    { Header: 'Info', accessor: 'info' },
  ];

  const normalized = transactions.reduce((p, c) => {
    if (!c) return p;
    if (c.__typename === 'InvoiceType') {
      if (!c.is_confirmed) return p;
      return [
        ...p,
        {
          type: <ArrowDown size={14} color={chartColors.green} />,
          value: (
            <S.nowrap>
              <Price amount={c.received} />
            </S.nowrap>
          ),
          date: <S.nowrap>{getDateDif(c.confirmed_at)}</S.nowrap>,
          info: <S.nowrap>{c.description || c.description_hash}</S.nowrap>,
        },
      ];
    }
    if (c.__typename === 'PaymentType') {
      if (!c.is_confirmed) return p;
      return [
        ...p,
        {
          type: <ArrowUp size={14} color={chartColors.red} />,
          value: (
            <S.nowrap>
              <Price amount={c.tokens} />
            </S.nowrap>
          ),
          date: <S.nowrap>{getDateDif(c.created_at)}</S.nowrap>,
          info: (
            <S.nowrap>
              {c.destination_node
                ? `Payment to ${c.destination_node.node?.alias || 'Unknown'}`
                : `Payment to ${shorten(c.destination)}`}
            </S.nowrap>
          ),
        },
      ];
    }
  }, [] as any);

  return (
    <S.wrapper>
      <S.title>Transactions</S.title>
      <S.table>
        <Table tableColumns={columns} tableData={normalized} />
      </S.table>
    </S.wrapper>
  );
};
