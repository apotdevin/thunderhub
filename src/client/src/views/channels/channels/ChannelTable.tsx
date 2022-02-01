import { useCallback, useMemo } from 'react';
import { ArrowDown, ArrowUp, Check, Circle } from 'react-feather';
import { toast } from 'react-toastify';
import { BalanceBars } from '../../../components/balance';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  getChannelLink,
  getNodeLink,
} from '../../../components/generic/helpers';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { Link } from '../../../components/link/Link';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Price } from '../../../components/price/Price';
import { Table } from '../../../components/table';
import { useGetChannelsQuery } from '../../../graphql/queries/__generated__/getChannels.generated';
import { useLocalStorage } from '../../../hooks/UseLocalStorage';
import { chartColors } from '../../../styles/Themes';
import { getErrorContent } from '../../../utils/error';
import { blockToTime, formatSeconds, getPercent } from '../../../utils/helpers';

const getBar = (top: number, bottom: number) => {
  const percent = (top / bottom) * 100;
  return Math.min(percent, 100);
};

export const ChannelTable = () => {
  const { data, loading, error } = useGetChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    'hiddenColumns',
    [] as string[]
  );

  const numberStringSorting = useCallback(
    (param: string) => (rowA: any, rowB: any) => {
      const rowAId = rowA?.original?.[param] || '0';
      const rowBId = rowB?.original?.[param] || '0';
      const rowAisBigger = Number(rowAId) >= Number(rowBId);
      return rowAisBigger ? 1 : -1;
    },
    []
  );

  const tableData = useMemo(() => {
    const channelData = data?.getChannels || [];

    const balanceArray = channelData.reduce((p, c) => {
      return [...p, c.remote_balance || 0, c.local_balance || 0];
    }, [] as number[]);

    const maxBalance = Math.max(...balanceArray);

    return channelData.map(c => {
      const myInfo = {
        myBase:
          Number(c.partner_fee_info.node_policies?.base_fee_mtokens || 0) /
          1000,
        myRate: c.partner_fee_info.node_policies?.fee_rate,
        myMaxHtlc:
          Number(c.partner_fee_info.node_policies?.max_htlc_mtokens || 0) /
          1000,
        myMinHtlc:
          Number(c.partner_fee_info.node_policies?.min_htlc_mtokens || 0) /
          1000,
      };

      const partnerInfo = {
        partnerBase:
          Number(
            c.partner_fee_info.partner_node_policies?.base_fee_mtokens || 0
          ) / 1000,
        partnerRate: c.partner_fee_info.partner_node_policies?.fee_rate,
        partnerMaxHtlc:
          Number(
            c.partner_fee_info.partner_node_policies?.max_htlc_mtokens || 0
          ) / 1000,
        partnerMinHtlc:
          Number(
            c.partner_fee_info.partner_node_policies?.min_htlc_mtokens || 0
          ) / 1000,
      };

      const status = {
        channelActive: c.is_active ? 1 : 0,
        channelActiveLogo: c.is_active ? (
          <Circle
            size={14}
            fill={chartColors.green}
            stroke={chartColors.green}
          />
        ) : (
          <Circle size={14} fill={'red'} stroke={'red'} />
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

      return {
        ...c,
        ...status,
        ...myInfo,
        ...pending,
        ...partnerInfo,
        alias: c.partner_node_info.node?.alias || 'Unknown',
        undercaseAlias: (
          c.partner_node_info.node?.alias || 'Unknown'
        ).toLowerCase(),
        channel_age_duplicate: c.channel_age,
        percentOnline: getPercent(timeOnline, timeOffline),
        percentOnlineText: `${getPercent(timeOnline, timeOffline)}%`,
        activityPercent: getPercent(c.sent, c.received),
        activityPercentText: `${getPercent(c.sent, c.received)}%`,
        balancePercent: getPercent(c.local_balance, c.remote_balance),
        balancePercentText: `${getPercent(c.local_balance, c.remote_balance)}%`,
        proportionalBars: (
          <div style={{ minWidth: '180px' }}>
            <BalanceBars
              local={getBar(c.local_balance, maxBalance)}
              remote={getBar(c.remote_balance, maxBalance)}
              formatLocal={
                <Price
                  amount={c.local_balance}
                  breakNumber={true}
                  noUnit={true}
                />
              }
              formatRemote={
                <Price
                  amount={c.remote_balance}
                  breakNumber={true}
                  noUnit={true}
                />
              }
            />
          </div>
        ),
        balanceBars: (
          <div style={{ minWidth: '180px' }}>
            <BalanceBars
              local={getPercent(c.local_balance, c.remote_balance)}
              remote={getPercent(c.remote_balance, c.local_balance)}
              formatLocal={
                <Price
                  amount={c.local_balance}
                  breakNumber={true}
                  noUnit={true}
                />
              }
              formatRemote={
                <Price
                  amount={c.remote_balance}
                  breakNumber={true}
                  noUnit={true}
                />
              }
            />
          </div>
        ),
        activityBars: (
          <div style={{ minWidth: '180px' }}>
            <BalanceBars
              local={getPercent(c.sent, c.received)}
              remote={getPercent(c.received, c.sent)}
              formatLocal={
                <Price amount={c.sent} breakNumber={true} noUnit={true} />
              }
              formatRemote={
                <Price amount={c.received} breakNumber={true} noUnit={true} />
              }
            />
          </div>
        ),
        viewAction: (
          <ColorButton>
            <Link to={`/channels/${c.id}`}> View</Link>
          </ColorButton>
        ),
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Status',
        columns: [
          {
            Header: 'Active',
            accessor: 'channelActiveLogo',
            sortType: numberStringSorting('channelActive'),
          },
          {
            Header: 'Private',
            accessor: 'channelPrivateLogo',
            sortType: numberStringSorting('channelPrivate'),
          },
          {
            Header: 'Initiated',
            accessor: 'channelOpenerLogo',
            sortType: numberStringSorting('channelOpener'),
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Peer',
            accessor: 'undercaseAlias',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                {getNodeLink(
                  row.original.partner_public_key,
                  row.original.alias
                )}
              </div>
            ),
          },
          {
            Header: 'Channel Id',
            accessor: 'id',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                {getChannelLink(row.original.id)}
              </div>
            ),
          },
          {
            Header: 'Capacity',
            accessor: 'capacity',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.capacity} />
              </div>
            ),
          },
          { Header: 'Block Age', accessor: 'channel_age' },
          {
            Header: 'Channel Age',
            accessor: 'channel_age_duplicate',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                {blockToTime(row.original.channel_age)}
              </div>
            ),
          },
          {
            Header: 'Past States',
            accessor: 'past_states',
          },
        ],
      },
      {
        Header: 'Balance',
        columns: [
          {
            Header: 'Local',
            accessor: 'local_balance',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.local_balance} />
              </div>
            ),
          },
          {
            Header: 'Remote',
            accessor: 'remote_balance',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.remote_balance} />
              </div>
            ),
          },
          {
            Header: 'Percent',
            accessor: 'balancePercentText',
            sortType: numberStringSorting('balancePercent'),
          },
        ],
      },
      {
        Header: 'Pending HTLC',
        columns: [
          { Header: 'Total HTLC', accessor: 'pending_total_amount' },
          { Header: 'Total Sats', accessor: 'pending_total_tokens' },
          { Header: 'Incoming HTLC', accessor: 'pending_incoming_amount' },
          { Header: 'Incoming Sats', accessor: 'pending_incoming_tokens' },
          { Header: 'Outgoing HTLC', accessor: 'pending_outgoing_amount' },
          { Header: 'Outgoing Sats', accessor: 'pending_outgoing_tokens' },
        ],
      },
      {
        Header: 'Monitoring',
        columns: [
          {
            Header: 'Online',
            accessor: 'time_online',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                {formatSeconds(
                  Math.round((row.original.time_online || 0) / 1000)
                )}
              </div>
            ),
          },
          {
            Header: 'Offline',
            accessor: 'time_offline',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                {formatSeconds(
                  Math.round((row.original.time_offline || 0) / 1000)
                )}
              </div>
            ),
          },
          {
            Header: 'Percent',
            accessor: 'percentOnlineText',
            sortType: numberStringSorting('percentOnline'),
          },
        ],
      },
      {
        Header: 'Activity',
        columns: [
          {
            Header: 'Sent',
            accessor: 'sent',
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
            Header: 'Percent',
            accessor: 'activityPercentText',
            sortType: numberStringSorting('activityPercent'),
          },
        ],
      },
      {
        Header: 'My Fees',
        columns: [
          { Header: 'Rate', accessor: 'myRate' },
          { Header: 'Base', accessor: 'myBase' },
        ],
      },
      {
        Header: 'Partner Fees',
        columns: [
          { Header: 'Rate', accessor: 'partnerRate' },
          { Header: 'Base', accessor: 'partnerBase' },
        ],
      },
      {
        Header: 'My HTLC',
        columns: [
          { Header: 'Max', accessor: 'myMaxHtlc' },
          { Header: 'Min', accessor: 'myMinHtlc' },
        ],
      },
      {
        Header: 'Partner HTLC',
        columns: [
          { Header: 'Max', accessor: 'partnerMaxHtlc' },
          { Header: 'Min', accessor: 'partnerMinHtlc' },
        ],
      },
      {
        Header: 'Bars',
        columns: [
          {
            Header: 'Balance',
            accessor: 'balanceBars',
            sortType: numberStringSorting('balancePercent'),
          },
          {
            Header: 'Proportional',
            accessor: 'proportionalBars',
            sortType: numberStringSorting('balancePercent'),
          },
          {
            Header: 'Activity',
            accessor: 'activityBars',
            sortType: numberStringSorting('activityPercent'),
          },
        ],
      },
      { Header: 'Actions', accessor: 'viewAction', forceVisible: true },
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

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (error) {
    return <DarkSubTitle>Error loading channels. Try refreshing.</DarkSubTitle>;
  }

  return (
    <Table
      withBorder={true}
      tableColumns={columns}
      tableData={tableData}
      onHideToggle={handleToggle}
      defaultHiddenColumns={hiddenColumns}
      filterPlaceholder="channels"
    />
  );
};
