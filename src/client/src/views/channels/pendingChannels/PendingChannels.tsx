import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useGetPendingChannelsQuery } from '../../../graphql/queries/__generated__/getPendingChannels.generated';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  getNodeLink,
  getTransactionLink,
} from '../../../components/generic/helpers';
import { Table } from '../../../components/table';
import { Price } from '../../../components/price/Price';

export const PendingChannels = () => {
  const { loading, data } = useGetPendingChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getPendingChannels || [];

    return channelData.map(c => {
      return {
        ...c,
        alias: c.partner_node_info.node?.alias || 'Unknown',
        capacity: (c.local_balance || 0) + (c.remote_balance || 0),
        force_closed: c.is_timelocked ? 'Yes' : '-',
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Status',
        accessor: 'is_opening',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.is_opening ? 'Opening' : 'Closing'}
          </div>
        ),
      },
      {
        Header: 'Peer',
        accessor: 'alias',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {getNodeLink(row.original.partner_public_key, row.original.alias)}
          </div>
        ),
      },
      {
        Header: 'Local Balance',
        accessor: 'local_balance',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.local_balance} />
          </div>
        ),
      },
      {
        Header: 'Remote Balance',
        accessor: 'remote_balance',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.remote_balance} />
          </div>
        ),
      },
      {
        Header: 'Balance',
        accessor: 'capacity',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.capacity} />
          </div>
        ),
      },
      {
        Header: 'Sent',
        accessor: 'send',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.sent} />
          </div>
        ),
      },
      {
        Header: 'Received',
        accessor: 'received',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.received} />
          </div>
        ),
      },
      {
        Header: 'Force Closed',
        accessor: 'force_closed',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.force_closed}
          </div>
        ),
      },
      {
        Header: 'Timelock Expiration',
        accessor: 'timelock_expiration',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${row.original.timelock_expiration} blocks`}
          </div>
        ),
      },
      {
        Header: 'Timelock Blocks',
        accessor: 'timelock_blocks',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${row.original.timelock_blocks} blocks`}
          </div>
        ),
      },
      {
        Header: 'Transaction Fee',
        accessor: 'transaction_fee',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.transaction_fee || '-'}
          </div>
        ),
      },
      {
        Header: 'Transaction',
        accessor: 'transaction_id',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {getTransactionLink(row.original.transaction_id)}
          </div>
        ),
      },
      {
        Header: 'Close Transaction',
        accessor: 'close_transaction_id',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
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
    return <DarkSubTitle>No pending channels found</DarkSubTitle>;
  }

  return (
    <Table
      withBorder={true}
      tableColumns={columns}
      tableData={tableData}
      filterPlaceholder="channels"
    />
  );
};
