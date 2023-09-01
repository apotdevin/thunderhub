import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getDateDif } from '../../components/generic/helpers';
import { DarkSubTitle } from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../utils/error';
import Table from '../../components/table';

type ForwardProps = {
  days: number;
};

export const ForwardsList: FC<ForwardProps> = ({ days }) => {
  const { loading, data } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getForwards || [];

    return channelData.map(c => {
      return {
        ...c,
        incoming_name: c.incoming_channel_info?.node2_info.alias || 'Unknown',
        outgoing_name: c.outgoing_channel_info?.node2_info.alias || 'Unknown',
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${getDateDif(row.original.created_at)} ago`}
          </div>
        ),
      },
      {
        header: 'Sats',
        columns: [
          {
            header: 'Forwarded',
            accessorKey: 'tokens',
            cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.tokens} />
              </div>
            ),
          },
          {
            header: 'Earned',
            accessorKey: 'fee',
            cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.fee} />
              </div>
            ),
          },
        ],
      },
      {
        header: 'Peer',
        columns: [
          {
            header: 'Incoming',
            accessorKey: 'incoming_name',
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: 'Outgoing',
            accessorKey: 'outgoing_name',
            cell: ({ cell }: any) => cell.renderValue(),
          },
        ],
      },
      {
        header: 'Channel',
        columns: [
          {
            header: 'Incoming',
            accessorKey: 'incoming_channel',
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: 'Outgoing',
            accessorKeyKey: 'outgoing_channel',
            cell: ({ cell }: any) => cell.renderValue(),
          },
        ],
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !data.getForwards?.length) {
    return <DarkSubTitle>No forwards found</DarkSubTitle>;
  }

  return (
    <Table
      withBorder={true}
      columns={columns}
      data={tableData}
      withSorting={true}
    />
  );
};
