import { FC } from 'react';
import Table from '../../../../components/table';

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
  order: string;
  forwardArray: RouteType[];
};

type ChannelTableProps = {
  order: string;
  forwardArray: ChannelType[];
};

export const RouteTable: FC<RouteTableProps> = ({ order, forwardArray }) => {
  const getTitle = () => {
    switch (order) {
      case 'fee':
        return 'Fee (sats)';
      case 'tokens':
        return 'Amount (sats)';
      default:
        return 'Count';
    }
  };

  const getAccesor = () => {
    switch (order) {
      case 'fee':
        return 'fee';
      case 'tokens':
        return 'tokens';
      default:
        return 'amount';
    }
  };

  const columns = [
    {
      header: 'In',
      accessorKey: 'incoming_alias',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Out',
      accessorKey: 'outgoing_alias',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: getTitle(),
      accessorKey: getAccesor(),
      cell: ({ cell }: any) => cell.renderValue(),
    },
  ];

  return <Table data={forwardArray} columns={columns} withSorting={true} />;
};

export const ChannelTable: FC<ChannelTableProps> = ({
  order,
  forwardArray,
}) => {
  const getTitle = () => {
    switch (order) {
      case 'fee':
        return 'Fee (sats)';
      case 'tokens':
        return 'Amount (sats)';
      default:
        return 'Count';
    }
  };

  const getAccesor = () => {
    switch (order) {
      case 'fee':
        return 'fee';
      case 'tokens':
        return 'tokens';
      default:
        return 'amount';
    }
  };

  const columns = [
    {
      header: 'Alias',
      accessorKey: 'alias',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Id',
      accessorKey: 'name',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: getTitle(),
      accessorKey: getAccesor(),
      cell: ({ cell }: any) => cell.renderValue(),
    },
  ];

  return <Table data={forwardArray} columns={columns} withSorting={true} />;
};
