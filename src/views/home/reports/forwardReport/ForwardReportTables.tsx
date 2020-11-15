import { FC } from 'react';
import { Table } from 'src/components/table';
import { ReportType } from './ForwardReport';

type RouteType = {
  route: string;
  aliasIn: string;
  aliasOut: string;
  fee: number;
  tokens: number;
  amount: number;
};

type ChannelType = {
  alias: string;
  name: string;
  fee: number;
  tokens: number;
  amount: number;
};

type RouteTableProps = {
  order: ReportType;
  forwardArray: RouteType[];
};

type ChannelTableProps = {
  order: ReportType;
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
        return 'Amount';
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

  return <Table tableData={forwardArray} tableColumns={columns} />;
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
        return 'Amount';
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

  return <Table tableData={forwardArray} tableColumns={columns} />;
};
