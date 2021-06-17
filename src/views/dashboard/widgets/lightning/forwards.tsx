import { getDateDif } from 'src/components/generic/helpers';
import { Price } from 'src/components/price/Price';
import { Table } from 'src/components/table';
import { useGetForwardsQuery } from 'src/graphql/queries/__generated__/getForwards.generated';
import { ChannelAlias } from 'src/views/home/reports/forwardReport/ChannelAlias';
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

export const ForwardListWidget = () => {
  const { data } = useGetForwardsQuery({ variables: { days: 7 } });

  const forwards = data?.getForwards || [];

  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Fee', accessor: 'fee' },
    { Header: 'Incoming', accessor: 'incoming' },
    { Header: 'Outgoing', accessor: 'outgoing' },
  ];

  const tableData = forwards.reduce((p, f) => {
    if (!f) return p;
    return [
      ...p,
      {
        date: <S.nowrap>{getDateDif(f.created_at)}</S.nowrap>,
        amount: (
          <S.nowrap>
            <Price amount={f.tokens} />
          </S.nowrap>
        ),
        fee: (
          <S.nowrap>
            <Price amount={f.fee} />
          </S.nowrap>
        ),
        incoming: <ChannelAlias id={f.incoming_channel} />,
        outgoing: <ChannelAlias id={f.outgoing_channel} />,
      },
    ];
  }, [] as any);

  return (
    <S.wrapper>
      <S.title>Forwards</S.title>
      <S.table>
        <Table tableColumns={columns} tableData={tableData} />
      </S.table>
    </S.wrapper>
  );
};
