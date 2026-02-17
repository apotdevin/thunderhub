import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetClosedChannelsQuery } from '../../../graphql/queries/__generated__/getClosedChannels.generated';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import Table from '../../../components/table';
import { Price } from '../../../components/price/Price';
import { blockToTime } from '../../../utils/helpers';
import { orderBy } from 'lodash';
import {
  getNodeLink,
  getTransactionLink,
} from '../../../components/generic/helpers';

export const ClosedChannels = () => {
  const { loading, data } = useGetClosedChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getClosedChannels || [];
    const sorted = orderBy(channelData, ['closed_for_blocks'], ['asc']);

    return sorted.map(c => {
      const getCloseType = (): string => {
        const types: string[] = [];

        if (c.is_breach_close) {
          types.push('Breach');
        }
        if (c.is_cooperative_close) {
          types.push('Cooperative');
        }
        if (c.is_funding_cancel) {
          types.push('Funding Cancel');
        }
        if (c.is_local_force_close) {
          types.push('Local Force Close');
        }
        if (c.is_remote_force_close) {
          types.push('Remote Force Close');
        }

        return types.join(', ');
      };

      return {
        ...c,
        alias: c.partner_node_info.node?.alias || 'Unknown',
        closeType: getCloseType(),
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Peer',
        accessorKey: 'alias',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {getNodeLink(row.original.partner_public_key, row.original.alias)}
          </div>
        ),
      },
      {
        header: 'Closed Since',
        accessorKey: 'closed_for_blocks',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {blockToTime(row.original.closed_for_blocks)}
          </div>
        ),
      },
      {
        header: 'Channel Age',
        accessorKey: 'channel_age',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {blockToTime(row.original.channel_age)}
          </div>
        ),
      },
      {
        header: 'Capacity',
        accessorKey: 'capacity',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.capacity} />
          </div>
        ),
      },
      {
        header: 'Close Type',
        accessorKey: 'closeType',
      },
      {
        header: 'Transaction Id',
        accessorKey: 'transaction_id',
        enableSorting: true,
        cell: ({ row }: any) => getTransactionLink(row.original.transaction_id),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !data.getClosedChannels) {
    return <DarkSubTitle>No closed channels found</DarkSubTitle>;
  }

  return (
    <Table
      columns={columns}
      data={tableData}
      withBorder={true}
      withGlobalSort={true}
      withSorting={true}
      filterPlaceholder="channels"
    />
  );
};
