import { useCallback, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Circle, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { BalanceBars } from '../../../components/balance';
import { ProgressBar } from '../../../components/generic/CardGeneric';
import {
  getChannelLink,
  getNodeLink,
} from '../../../components/generic/helpers';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { CloseChannel } from '../../../components/modal/closeChannel/CloseChannel';
import Modal from '../../../components/modal/ReactModal';
import { Price } from '../../../components/price/Price';
import Table from '../../../components/table';
import { useGetChannelsQuery } from '../../../graphql/queries/__generated__/getChannels.generated';
import { useLocalStorage } from '../../../hooks/UseLocalStorage';
import { useChartColors } from '../../../lib/chart-colors';
import { getErrorContent } from '../../../utils/error';
import {
  blockToTime,
  formatNumber,
  formatSeconds,
  getPercent,
} from '../../../utils/helpers';
import { colorFromString } from '../../../utils/color';
import { ChannelDetails } from './ChannelDetails';
import { defaultHiddenColumns } from './helpers';
import { VisibilityState } from '@tanstack/react-table';

const getBar = (top: number, bottom: number) => {
  const percent = (top / bottom) * 100;
  return Math.min(percent, 100);
};

const BTC_COLOR = '#f7931a';
const REMOTE_COLOR = '#9ca3af';

export const ChannelTable = () => {
  const chartColors = useChartColors();

  const [channel, setChannel] = useState<{
    name: string;
    channel: string;
    action: string;
  } | null>();

  const { data, loading, error } = useGetChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    'hiddenColumns-v2',
    defaultHiddenColumns
  );

  const numberStringSorting = useCallback(
    (param: string) => (rowA: any, rowB: any) => {
      const rowAId = rowA?.original?.[param] || '0';
      const rowBId = rowB?.original?.[param] || '0';
      return Number(rowAId) >= Number(rowBId) ? 1 : -1;
    },
    []
  );

  const tableData = useMemo(() => {
    const channelData = data?.getChannels || [];

    const balanceArray = channelData.reduce(
      (p, c) => [...p, c.remote_balance || 0, c.local_balance || 0],
      [] as number[]
    );

    const maxBalance = Math.max(...balanceArray);

    return channelData.map(c => {
      const myInfo = {
        myBase:
          Number(c.partner_fee_info?.node_policies?.base_fee_mtokens || 0) /
          1000,
        myRate: c.partner_fee_info?.node_policies?.fee_rate,
        myMaxHtlc:
          Number(c.partner_fee_info?.node_policies?.max_htlc_mtokens || 0) /
          1000,
        myMinHtlc:
          Number(c.partner_fee_info?.node_policies?.min_htlc_mtokens || 0) /
          1000,
      };

      const partnerInfo = {
        partnerBase:
          Number(
            c.partner_fee_info?.partner_node_policies?.base_fee_mtokens || 0
          ) / 1000,
        partnerRate: c.partner_fee_info?.partner_node_policies?.fee_rate,
        partnerMaxHtlc:
          Number(
            c.partner_fee_info?.partner_node_policies?.max_htlc_mtokens || 0
          ) / 1000,
        partnerMinHtlc:
          Number(
            c.partner_fee_info?.partner_node_policies?.min_htlc_mtokens || 0
          ) / 1000,
      };

      const status = {
        channelActive: c.is_active ? 1 : 0,
        channelActiveLogo: (
          <Circle
            size={14}
            fill={c.is_active ? chartColors.green : 'red'}
            stroke={c.is_active ? chartColors.green : 'red'}
          />
        ),
        channelPrivate: c.is_private ? 1 : 0,
        channelPrivateLogo: c.is_private ? (
          <Check size={14} stroke={chartColors.lightblue} />
        ) : null,
        channelOpener: c.is_partner_initiated ? 1 : 0,
        channelOpenerLogo: c.is_partner_initiated ? (
          <ArrowDown size={14} stroke={chartColors.purple} />
        ) : (
          <ArrowUp size={14} stroke={chartColors.orange} />
        ),
      };

      const pending = {
        pending_incoming_amount: c.pending_resume.incoming_amount || '-',
        pending_incoming_tokens: c.pending_resume.incoming_tokens || '-',
        pending_outgoing_amount: c.pending_resume.outgoing_amount || '-',
        pending_outgoing_tokens: c.pending_resume.outgoing_tokens || '-',
        pending_total_amount: c.pending_resume.total_amount || '-',
        pending_total_tokens: c.pending_resume.total_tokens || '-',
      };

      const timeOnline = c.time_online || 0;
      const timeOffline = c.time_offline || 0;

      const actions = {
        editAction: (
          <button
            className="inline-flex items-center justify-center border-none bg-transparent p-0 text-inherit cursor-pointer hover:text-orange-400"
            onClick={() =>
              setChannel({
                channel: c.id,
                action: 'edit',
                name: c.partner_node_info.node?.alias || 'Unknown',
              })
            }
          >
            <Edit size={14} />
          </button>
        ),
        closeAction: (
          <button
            className="inline-flex items-center justify-center border-none bg-transparent p-0 text-inherit cursor-pointer hover:text-orange-400"
            onClick={() =>
              setChannel({
                channel: c.id,
                action: 'close',
                name: c.partner_node_info.node?.alias || 'Unknown',
              })
            }
          >
            <X size={14} />
          </button>
        ),
      };

      const asset = c.asset;
      const localBal = asset ? Number(asset.localBalance) : c.local_balance;
      const remoteBal = asset ? Number(asset.remoteBalance) : c.remote_balance;

      const assetKey = asset?.groupKey || asset?.assetId || '';
      const assetColor = asset ? colorFromString(assetKey) : undefined;

      const assetBar = asset ? (
        <div className="mt-1">
          <div className="text-xs text-gray-500 mb-0.5 text-center">
            {asset.assetName || asset.assetId.slice(0, 8)}
          </div>
          <BalanceBars
            local={getPercent(
              Number(asset.localBalance),
              Number(asset.remoteBalance)
            )}
            remote={getPercent(
              Number(asset.remoteBalance),
              Number(asset.localBalance)
            )}
            formatLocal={formatNumber(asset.localBalance)}
            formatRemote={formatNumber(asset.remoteBalance)}
            localColor={assetColor}
            remoteColor={REMOTE_COLOR}
          />
        </div>
      ) : null;

      return {
        ...c,
        ...status,
        ...myInfo,
        ...pending,
        ...partnerInfo,
        ...actions,
        alias: c.partner_node_info.node?.alias || 'Unknown',
        undercaseAlias: (
          c.partner_node_info.node?.alias || 'Unknown'
        ).toLowerCase(),
        channel_age_duplicate: c.channel_age,
        percentOnline: getPercent(timeOnline, timeOffline),
        percentOnlineText: `${getPercent(timeOnline, timeOffline)}%`,
        activityPercent: getPercent(c.sent, c.received),
        activityPercentText: `${getPercent(c.sent, c.received)}%`,
        activityFlowIndex: (
          ((c.sent + c.received) / c.capacity / c.channel_age) *
          144 *
          30
        ).toFixed(2),
        balancePercent: getPercent(localBal, remoteBal),
        remoteBalancePercent: getPercent(remoteBal, localBal),
        balancePercentText: `${getPercent(localBal, remoteBal)}%`,
        proportionalBars: (
          <div className="min-w-[180px]">
            <BalanceBars
              local={getBar(c.local_balance, maxBalance)}
              remote={getBar(c.remote_balance, maxBalance)}
              formatLocal={
                <Price amount={c.local_balance} breakNumber={true} />
              }
              formatRemote={
                <Price amount={c.remote_balance} breakNumber={true} />
              }
              localColor={BTC_COLOR}
              remoteColor={REMOTE_COLOR}
            />
            {assetBar}
          </div>
        ),
        balanceBarsLocal: (() => {
          const btcPct = getPercent(c.local_balance, c.remote_balance);
          const assetPct = asset
            ? getPercent(
                Number(asset.localBalance),
                Number(asset.remoteBalance)
              )
            : 0;
          return (
            <div className="min-w-[80px]">
              <div className="w-full flex">
                <ProgressBar
                  barHeight={10}
                  order={1}
                  percent={btcPct}
                  style={{ backgroundColor: BTC_COLOR }}
                />
                <ProgressBar barHeight={10} order={4} percent={100 - btcPct} />
              </div>
              <div>
                <Price amount={c.local_balance} breakNumber={true} />
              </div>
              {asset && (
                <>
                  <div className="w-full flex mt-1">
                    <ProgressBar
                      barHeight={10}
                      order={1}
                      percent={assetPct}
                      style={{ backgroundColor: assetColor }}
                    />
                    <ProgressBar
                      barHeight={10}
                      order={4}
                      percent={100 - assetPct}
                    />
                  </div>
                  <div className="text-xs">
                    {formatNumber(asset.localBalance)}{' '}
                    <span className="text-gray-500">
                      {asset.assetName || asset.assetId.slice(0, 8)}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })(),
        balanceBarsRemote: (() => {
          const btcPct = getPercent(c.remote_balance, c.local_balance);
          const assetPct = asset
            ? getPercent(
                Number(asset.remoteBalance),
                Number(asset.localBalance)
              )
            : 0;
          return (
            <div className="min-w-[80px]">
              <div className="w-full flex">
                <ProgressBar
                  barHeight={10}
                  order={2}
                  percent={btcPct}
                  style={{ backgroundColor: REMOTE_COLOR }}
                />
                <ProgressBar barHeight={10} order={4} percent={100 - btcPct} />
              </div>
              <div>
                <Price amount={c.remote_balance} breakNumber={true} />
              </div>
              {asset && (
                <>
                  <div className="w-full flex mt-1">
                    <ProgressBar
                      barHeight={10}
                      order={2}
                      percent={assetPct}
                      style={{ backgroundColor: REMOTE_COLOR }}
                    />
                    <ProgressBar
                      barHeight={10}
                      order={4}
                      percent={100 - assetPct}
                    />
                  </div>
                  <div className="text-xs">
                    {formatNumber(asset.remoteBalance)}{' '}
                    <span className="text-gray-500">
                      {asset.assetName || asset.assetId.slice(0, 8)}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })(),
        activityBars: (
          <div className="min-w-[180px]">
            <BalanceBars
              local={getPercent(c.received, c.sent)}
              remote={getPercent(c.sent, c.received)}
              formatLocal={
                <Price amount={c.received} breakNumber={true} noUnit={true} />
              }
              formatRemote={
                <Price amount={c.sent} breakNumber={true} noUnit={true} />
              }
            />
          </div>
        ),
      };
    });
  }, [data, chartColors]);

  const columns = useMemo(
    () => [
      {
        header: 'Status',
        columns: [
          {
            header: 'Active',
            accessorKey: 'channelActiveLogo',
            sortingFn: numberStringSorting('channelActive'),
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: 'Private',
            accessorKey: 'channelPrivateLogo',
            sortingFn: numberStringSorting('channelPrivate'),
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: 'Initiated',
            accessorKey: 'channelOpenerLogo',
            sortingFn: numberStringSorting('channelOpener'),
            cell: ({ cell }: any) => cell.renderValue(),
          },
        ],
      },
      {
        header: 'Actions',
        columns: [
          {
            header: <Edit size={14} />,
            accessorKey: 'editAction',
            enableSorting: false,
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: <X size={14} />,
            accessorKey: 'closeAction',
            enableSorting: false,
            cell: ({ cell }: any) => cell.renderValue(),
          },
        ],
      },
      {
        header: 'Info',
        columns: [
          {
            header: 'Peer',
            accessorKey: 'undercaseAlias',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                {getNodeLink(
                  row.original.partner_public_key,
                  row.original.alias
                )}
              </div>
            ),
          },
          {
            header: 'Channel Id',
            accessorKey: 'id',
            enableHiding: false,
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                {getChannelLink(row.original.id)}
              </div>
            ),
          },
          {
            header: 'Capacity',
            accessorKey: 'capacity',
            cell: ({ row }: any) => {
              const asset = row.original.asset;
              return (
                <div className="whitespace-nowrap">
                  <div>
                    <Price amount={row.original.capacity} />
                  </div>
                  {asset && (
                    <div className="text-xs">
                      {asset.capacity}{' '}
                      <span className="text-gray-500">
                        {asset.assetName || asset.assetId.slice(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              );
            },
          },
          { header: 'Block Age', accessorKey: 'channel_age' },
          {
            header: 'Channel Age',
            accessorKey: 'channel_age_duplicate',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                {blockToTime(row.original.channel_age)}
              </div>
            ),
          },
          {
            header: 'Past States',
            accessorKey: 'past_states',
          },
        ],
      },
      {
        header: 'Balance',
        columns: [
          {
            header: 'Local',
            accessorKey: 'local_balance',
            cell: ({ row }: any) => {
              const asset = row.original.asset;
              return (
                <div className="whitespace-nowrap">
                  <div>
                    <Price amount={row.original.local_balance} />
                  </div>
                  {asset && (
                    <div className="text-xs">
                      {formatNumber(asset.localBalance)}{' '}
                      <span className="text-gray-500">
                        {asset.assetName || asset.assetId.slice(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            header: 'Remote',
            accessorKey: 'remote_balance',
            cell: ({ row }: any) => {
              const asset = row.original.asset;
              return (
                <div className="whitespace-nowrap">
                  <div>
                    <Price amount={row.original.remote_balance} />
                  </div>
                  {asset && (
                    <div className="text-xs">
                      {formatNumber(asset.remoteBalance)}{' '}
                      <span className="text-gray-500">
                        {asset.assetName || asset.assetId.slice(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            header: 'Percent',
            accessorKey: 'balancePercentText',
            sortingFn: numberStringSorting('balancePercent'),
          },
        ],
      },
      {
        header: 'Pending HTLC',
        columns: [
          { header: 'Total HTLC', accessorKey: 'pending_total_amount' },
          { header: 'Total Sats', accessorKey: 'pending_total_tokens' },
          { header: 'Incoming HTLC', accessorKey: 'pending_incoming_amount' },
          { header: 'Incoming Sats', accessorKey: 'pending_incoming_tokens' },
          { header: 'Outgoing HTLC', accessorKey: 'pending_outgoing_amount' },
          { header: 'Outgoing Sats', accessorKey: 'pending_outgoing_tokens' },
        ],
      },
      {
        header: 'Monitoring',
        columns: [
          {
            header: 'Online',
            accessorKey: 'time_online',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                {formatSeconds(
                  Math.round((row.original.time_online || 0) / 1000)
                )}
              </div>
            ),
          },
          {
            header: 'Offline',
            accessorKey: 'time_offline',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                {formatSeconds(
                  Math.round((row.original.time_offline || 0) / 1000)
                )}
              </div>
            ),
          },
          {
            header: 'Percent',
            accessorKey: 'percentOnlineText',
            sortingFn: numberStringSorting('percentOnline'),
          },
        ],
      },
      {
        header: 'Activity',
        columns: [
          {
            header: 'Received',
            accessorKey: 'received',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                <Price amount={row.original.received} />
              </div>
            ),
          },
          {
            header: 'Sent',
            accessorKey: 'sent',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap">
                <Price amount={row.original.sent} />
              </div>
            ),
          },
          {
            header: 'Percent',
            accessorKey: 'activityPercentText',
            sortingFn: numberStringSorting('activityPercent'),
          },
          {
            header: 'Flow index',
            accessorKey: 'activityFlowIndex',
            sortingFn: numberStringSorting('activityFlowIndex'),
          },
        ],
      },
      {
        header: 'My Fees',
        columns: [
          { header: 'Rate', accessorKey: 'myRate' },
          { header: 'Base', accessorKey: 'myBase' },
        ],
      },
      {
        header: 'Partner Fees',
        columns: [
          { header: 'Rate', accessorKey: 'partnerRate' },
          { header: 'Base', accessorKey: 'partnerBase' },
        ],
      },
      {
        header: 'My HTLC',
        columns: [
          { header: 'Max', accessorKey: 'myMaxHtlc' },
          { header: 'Min', accessorKey: 'myMinHtlc' },
        ],
      },
      {
        header: 'Partner HTLC',
        columns: [
          { header: 'Max', accessorKey: 'partnerMaxHtlc' },
          { header: 'Min', accessorKey: 'partnerMinHtlc' },
        ],
      },
      {
        header: 'Bars',
        columns: [
          {
            header: 'Balance',
            columns: [
              {
                header: 'Local',
                accessorKey: 'balanceBarsLocal',
                sortingFn: numberStringSorting('balancePercent'),
                cell: ({ cell }: any) => cell.renderValue(),
              },
              {
                header: 'Remote',
                accessorKey: 'balanceBarsRemote',
                sortingFn: numberStringSorting('remoteBalancePercent'),
                cell: ({ cell }: any) => cell.renderValue(),
              },
            ],
          },
          {
            header: 'Proportional',
            accessorKey: 'proportionalBars',
            sortingFn: numberStringSorting('local_balance'),
            cell: ({ cell }: any) => cell.renderValue(),
          },
          {
            header: 'Activity',
            accessorKey: 'activityBars',
            sortingFn: numberStringSorting('activityPercent'),
            cell: ({ cell }: any) => cell.renderValue(),
          },
        ],
      },
    ],
    [numberStringSorting]
  );

  const handleToggle = (hide: boolean, id: string) => {
    const filtered = hiddenColumns.filter(key => key !== id);
    if (hide) {
      setHiddenColumns([...filtered, id]);
    } else {
      setHiddenColumns(filtered);
    }
  };

  const hiddenColumnState: VisibilityState = useMemo(() => {
    const defaultColumns: VisibilityState = {};
    hiddenColumns.forEach(c => {
      defaultColumns[c] = false;
    });
    return defaultColumns;
  }, [hiddenColumns]);

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Error loading channels. Try refreshing.
      </div>
    );
  }

  const renderModalContent = () => {
    if (!channel?.channel) return;

    switch (channel.action) {
      case 'edit':
        return <ChannelDetails id={channel.channel} name={channel.name} />;
      case 'close':
        return (
          <CloseChannel
            channelId={channel.channel}
            channelName={channel.name}
            callback={() => setChannel(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={tableData}
        withGlobalSort={true}
        withSorting={true}
        initSorting={[{ id: 'balanceBarsLocal', desc: false }]}
        toggleConfiguration={handleToggle}
        defaultHiddenColumns={hiddenColumnState}
        filterPlaceholder="channels"
      />
      <Modal isOpen={!!channel} closeCallback={() => setChannel(null)}>
        {renderModalContent()}
      </Modal>
    </>
  );
};
