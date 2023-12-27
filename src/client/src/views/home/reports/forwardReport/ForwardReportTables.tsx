import { FC } from 'react';
import Table from '../../../../components/table';
import {
  AggregatedChannelSideForwards,
  AggregatedRouteForwards,
} from '../../../../graphql/types';
import { getNodeLink } from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';
import { numberWithCommas } from '../../../../utils/number';

export type RouteType = {
  route: string;
  incoming_channel: string;
  outgoing_channel: string;
  fee: number;
  tokens: number;
  amount: number;
};

export type ChannelType = {
  channelId: string;
  name: string;
  fee: number;
  tokens: number;
  amount: number;
};

type RouteTableProps = {
  forwardArray: AggregatedRouteForwards[];
};

type ChannelTableProps = {
  forwardArray: AggregatedChannelSideForwards[];
};

export const RouteTable: FC<RouteTableProps> = ({ forwardArray }) => {
  const columns = [
    {
      header: 'In',
      accessorKey: 'incoming_alias',
      cell: ({ row }: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {getNodeLink(
            row.original.incoming_channel_info?.node2_info?.public_key,
            row.original.incoming_channel_info?.node2_info?.alias
          )}
        </div>
      ),
    },
    {
      header: 'Out',
      accessorKey: 'outgoing_alias',
      cell: ({ row }: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {getNodeLink(
            row.original.outgoing_channel_info?.node2_info?.public_key,
            row.original.outgoing_channel_info?.node2_info?.alias
          )}
        </div>
      ),
    },
    {
      header: 'Count',
      accessorKey: 'count',
      cell: ({ row }: any) => numberWithCommas(row.original.count),
    },
    {
      header: 'Fee (sats)',
      accessorKey: 'fee',
      cell: ({ row }: any) => <Price amount={row.original.fee} />,
    },
    {
      header: 'Amount (sats)',
      accessorKey: 'tokens',
      cell: ({ row }: any) => <Price amount={row.original.tokens} />,
    },
  ];

  return <Table data={forwardArray} columns={columns} withSorting={true} />;
};

export const ChannelTable: FC<ChannelTableProps> = ({ forwardArray }) => {
  const columns = [
    {
      header: 'Alias',
      accessorKey: 'alias',
      cell: ({ row }: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {getNodeLink(
            row.original.channel_info.node2_info.public_key,
            row.original.channel_info.node2_info.alias
          )}
        </div>
      ),
    },
    {
      header: 'Id',
      accessorKey: 'name',
      cell: ({ row }: any) => row.original.channel,
    },
    {
      header: 'Count',
      accessorKey: 'count',
      cell: ({ row }: any) => numberWithCommas(row.original.count),
    },
    {
      header: 'Fee (sats)',
      accessorKey: 'fee',
      cell: ({ row }: any) => <Price amount={row.original.fee} />,
    },
    {
      header: 'Amount (sats)',
      accessorKey: 'tokens',
      cell: ({ row }: any) => <Price amount={row.original.tokens} />,
    },
  ];

  return <Table data={forwardArray} columns={columns} withSorting={true} />;
};
