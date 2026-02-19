import { FC } from 'react';
import toast from 'react-hot-toast';
import { Price } from '../../components/price/Price';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../utils/error';
import Table from '../../components/table';
import { getChannelLink, getNodeLink } from '../../components/generic/helpers';
import { numberWithCommas } from '../../utils/number';

export const ForwardTable: FC<{ days: number }> = ({ days }) => {
  const { data, loading } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data?.getForwards?.list.length) {
    return null;
  }

  const tableData = data.getForwards.by_channel || [];

  const columns = [
    {
      header: 'Alias',
      accessorKey: 'alias',
      cell: ({ row }: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {getNodeLink(
            row.original.channel_info?.node2_info?.public_key,
            row.original.channel_info?.node2_info?.alias
          )}
        </div>
      ),
    },
    {
      header: 'Channel',
      accessorKey: 'channel',
      cell: ({ row }: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {getChannelLink(row.original.channel)}
        </div>
      ),
    },
    {
      header: 'Incoming',
      columns: [
        {
          header: 'Count',
          accessorKey: 'incoming.count',
          cell: ({ row }: any) => numberWithCommas(row.original.incoming.count),
        },
        {
          header: 'Fee (sats)',
          accessorKey: 'incoming.fee',
          cell: ({ row }: any) => <Price amount={row.original.incoming.fee} />,
        },
        {
          header: 'Amount (sats)',
          accessorKey: 'incoming.tokens',
          cell: ({ row }: any) => (
            <Price amount={row.original.incoming.tokens} />
          ),
        },
      ],
    },
    {
      header: 'Outgoing',
      columns: [
        {
          header: 'Count',
          accessorKey: 'outgoing.count',
          cell: ({ row }: any) => numberWithCommas(row.original.outgoing.count),
        },
        {
          header: 'Fee (sats)',
          accessorKey: 'outgoing.fee',
          cell: ({ row }: any) => <Price amount={row.original.outgoing.fee} />,
        },
        {
          header: 'Amount (sats)',
          accessorKey: 'outgoing.tokens',
          cell: ({ row }: any) => (
            <Price amount={row.original.outgoing.tokens} />
          ),
        },
      ],
    },
  ];

  return <Table data={tableData} columns={columns} withSorting={true} />;
};
