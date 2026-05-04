import React, { useMemo } from 'react';
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
import { BalanceBars } from '../../../components/balance';
import { colorFromString } from '../../../utils/color';
import { formatAssetAmount, getPercent } from '../../../utils/helpers';
import { Asset, REMOTE_COLOR } from '../types';

export const PendingChannels = ({
  assetOnly,
}: { assetOnly?: boolean } = {}) => {
  const { loading, data } = useGetPendingChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const uniqueAssets = useMemo(() => {
    const allChannels = data?.getPendingChannels || [];
    const channelData = assetOnly
      ? allChannels.filter(c => c.asset)
      : allChannels;
    const map = new Map<string, Asset>();
    for (const c of channelData) {
      if (c.asset) {
        const key = c.asset.group_key || c.asset.asset_id;
        if (!map.has(key)) {
          map.set(key, {
            asset_id: c.asset.asset_id,
            asset_name: c.asset.asset_name,
            group_key: c.asset.group_key ?? undefined,
            asset_precision: c.asset.asset_precision,
          });
        }
      }
    }
    return map;
  }, [data, assetOnly]);

  const tableData = useMemo(() => {
    const allChannels = data?.getPendingChannels || [];
    const channelData = assetOnly
      ? allChannels.filter(c => c.asset)
      : allChannels;

    return channelData.map(c => {
      const assetFields: Record<string, React.ReactNode> = {};
      const channelAssetKey = c.asset
        ? c.asset.group_key || c.asset.asset_id
        : null;
      for (const [key, assetInfo] of uniqueAssets) {
        const match = channelAssetKey === key;
        const prefix = `asset_${key}`;
        const precision = assetInfo.asset_precision;

        assetFields[`${prefix}_capacity`] = match
          ? formatAssetAmount(c.asset!.capacity, precision)
          : null;
        assetFields[`${prefix}_local`] = match
          ? formatAssetAmount(c.asset!.local_balance, precision)
          : null;
        assetFields[`${prefix}_remote`] = match
          ? formatAssetAmount(c.asset!.remote_balance, precision)
          : null;
        assetFields[`${prefix}_balancePercent`] = match
          ? getPercent(
              Number(c.asset!.local_balance),
              Number(c.asset!.remote_balance)
            )
          : 0;

        const assetColor = colorFromString(key);
        assetFields[`${prefix}_balanceBar`] = match ? (
          <div className="min-w-45">
            <BalanceBars
              local={getPercent(
                Number(c.asset!.local_balance),
                Number(c.asset!.remote_balance)
              )}
              remote={getPercent(
                Number(c.asset!.remote_balance),
                Number(c.asset!.local_balance)
              )}
              formatLocal={formatAssetAmount(c.asset!.local_balance, precision)}
              formatRemote={formatAssetAmount(
                c.asset!.remote_balance,
                precision
              )}
              localColor={assetColor}
              remoteColor={REMOTE_COLOR}
            />
          </div>
        ) : null;
      }

      return {
        ...c,
        ...assetFields,
        alias: c.partner_node_info.node?.alias || 'Unknown',
        capacity: (c.local_balance || 0) + (c.remote_balance || 0),
        force_closed: c.is_timelocked ? 'Yes' : '-',
      };
    });
  }, [data, assetOnly, uniqueAssets]);

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
      ...Array.from(uniqueAssets.entries()).map(([key, assetInfo]) => {
        const prefix = `asset_${key}`;
        const name = assetInfo.asset_name || assetInfo.asset_id.slice(0, 8);

        return {
          id: prefix,
          header: `Asset (${name})`,
          columns: [
            {
              header: 'Capacity',
              accessorKey: `${prefix}_capacity`,
              cell: ({ cell }: any) => {
                const val = cell.getValue();
                return val != null ? (
                  <div className="whitespace-nowrap">{val}</div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                );
              },
            },
            {
              header: 'Local',
              accessorKey: `${prefix}_local`,
              cell: ({ cell }: any) => {
                const val = cell.getValue();
                return val != null ? (
                  <div className="whitespace-nowrap">{val}</div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                );
              },
            },
            {
              header: 'Remote',
              accessorKey: `${prefix}_remote`,
              cell: ({ cell }: any) => {
                const val = cell.getValue();
                return val != null ? (
                  <div className="whitespace-nowrap">{val}</div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                );
              },
            },
            {
              header: 'Balance',
              accessorKey: `${prefix}_balanceBar`,
              cell: ({ cell }: any) =>
                cell.renderValue() || (
                  <span className="text-muted-foreground">-</span>
                ),
            },
          ],
        };
      }),
    ],
    [uniqueAssets]
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !tableData.length) {
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
