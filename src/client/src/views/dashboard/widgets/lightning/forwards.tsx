import { getDateDif } from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';
import Table from '../../../../components/table';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
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
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Fee',
      accessorKey: 'fee',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Incoming',
      accessorKey: 'incoming',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Outgoing',
      accessorKey: 'outgoing',
      cell: ({ cell }: any) => cell.renderValue(),
    },
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
        incoming: f.incoming_channel_info.node2_info.alias || '',
        outgoing: f.outgoing_channel_info.node2_info.alias || '',
      },
    ];
  }, [] as any);

  return (
    <S.wrapper>
      <S.title>Forwards</S.title>
      <S.table>
        <Table columns={columns} data={tableData} withSorting={true} />
      </S.table>
    </S.wrapper>
  );
};
