import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetPendingChannelsQuery } from '../../../graphql/queries/__generated__/getPendingChannels.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  getNodeLink,
  getTransactionLink,
} from '../../../components/generic/helpers';
import Table from '../../../components/table';
import { Price } from '../../../components/price/Price';
import { ColumnDef } from '@tanstack/react-table';
import { PendingChannel } from '../../../graphql/types';

export const PendingChannels = () => {
  const { loading, data } = useGetPendingChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getPendingChannels || [];

    return channelData.map(c => ({
      ...c,
      alias: c.partner_node_info.node?.alias || 'Unknown',
      capacity: (c.local_balance || 0) + (c.remote_balance || 0),
      force_closed: c.is_timelocked ? 'Yes' : '-',
    }));
  }, [data]);

  const columns = useMemo<ColumnDef<PendingChannel, any>[]>(
    () => [
      {
        header: 'Status',
        accessorKey: 'is_opening',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {row.original.is_opening ? 'Opening' : 'Closing'}
          </div>
        ),
      },
      {
        header: 'Peer',
        accessorKey: 'alias',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {getNodeLink(row.original.partner_public_key, row.original.alias)}
          </div>
        ),
      },
      {
        header: 'Local Balance',
        accessorKey: 'local_balance',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            <Price amount={row.original.local_balance} />
          </div>
        ),
      },
      {
        header: 'Remote Balance',
        accessorKey: 'remote_balance',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            <Price amount={row.original.remote_balance} />
          </div>
        ),
      },
      {
        header: 'Balance',
        accessorKey: 'capacity',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            <Price amount={row.original.capacity} />
          </div>
        ),
      },
      {
        header: 'Sent',
        accessorKey: 'send',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            <Price amount={row.original.sent} />
          </div>
        ),
      },
      {
        header: 'Received',
        accessorKey: 'received',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            <Price amount={row.original.received} />
          </div>
        ),
      },
      {
        header: 'Force Closed',
        accessorKey: 'force_closed',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">{row.original.force_closed}</div>
        ),
      },
      {
        header: 'Timelock Expiration',
        accessorKey: 'timelock_expiration',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {row.original.timelock_expiration
              ? `${row.original.timelock_expiration} blocks`
              : '-'}
          </div>
        ),
      },
      {
        header: 'Timelock Blocks',
        accessorKey: 'timelock_blocks',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {row.original.timelock_blocks
              ? `${row.original.timelock_blocks} blocks`
              : '-'}
          </div>
        ),
      },
      {
        header: 'Transaction Fee',
        accessorKey: 'transaction_fee',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {row.original.transaction_fee || '-'}
          </div>
        ),
      },
      {
        header: 'Transaction',
        accessorKey: 'transaction_id',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {getTransactionLink(row.original.transaction_id)}
          </div>
        ),
      },
      {
        header: 'Close Transaction',
        accessorKey: 'close_transaction_id',
        enableSorting: true,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {getTransactionLink(row.original.close_transaction_id)}
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !data.getPendingChannels?.length) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        No pending channels found
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={tableData}
      withGlobalSort={true}
      withSorting={true}
      filterPlaceholder="channels"
    />
  );
};
