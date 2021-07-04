import { FC } from 'react';
import { Table } from 'src/components/table';
import { ChannelAlias } from './ChannelAlias';

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
        return 'Tokens (sats)';
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
    { Header: 'In', accessor: 'aliasIn' },
    { Header: 'Out', accessor: 'aliasOut' },
    { Header: getTitle(), accessor: getAccesor() },
  ];

  const tableData = forwardArray.map(f => ({
    ...f,
    aliasIn: <ChannelAlias id={f.incoming_channel} />,
    aliasOut: <ChannelAlias id={f.outgoing_channel} />,
  }));

  return <Table tableData={tableData} tableColumns={columns} />;
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
        return 'Tokens (sats)';
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
    { Header: 'Alias', accessor: 'alias' },
    { Header: 'Id', accessor: 'name' },
    { Header: getTitle(), accessor: getAccesor() },
  ];

  const tableData = forwardArray.map(f => ({
    ...f,
    alias: <ChannelAlias id={f.channelId} />,
  }));

  return <Table tableData={tableData} tableColumns={columns} />;
};
