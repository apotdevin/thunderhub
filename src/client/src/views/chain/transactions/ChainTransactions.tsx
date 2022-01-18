import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useGetChainTransactionsQuery } from '../../../graphql/queries/__generated__/getChainTransactions.generated';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { Table } from '../../../components/table';
import {
  getAddressLink,
  getDateDif,
  getTransactionLink,
} from '../../../components/generic/helpers';
import { Price } from '../../../components/price/Price';
import { ArrowDown, ArrowUp } from 'react-feather';
import { chartColors } from '../../../styles/Themes';

export const ChainTransactions = () => {
  const { loading, data } = useGetChainTransactionsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getChainTransactions || [];

    return channelData.map(c => {
      return {
        ...c,
        transaction_type: c.fee !== null ? 'Sent' : 'Received',
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'transaction_type',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.transaction_type === 'Sent' ? (
              <ArrowUp color={chartColors.red} size={16} />
            ) : (
              <ArrowDown color={chartColors.green} size={16} />
            )}
          </div>
        ),
      },
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${getDateDif(row.original.created_at)} ago`}
          </div>
        ),
      },
      {
        Header: 'Sats',
        accessor: 'tokens',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.tokens} />
          </div>
        ),
      },
      {
        Header: 'Fee',
        accessor: 'fee',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.fee} />
          </div>
        ),
      },
      { Header: 'Confirmations', accessor: 'confirmation_count' },
      { Header: 'Confirmation Block', accessor: 'confirmation_height' },
      {
        Header: 'Output Addresses',
        accessor: 'output_addresses',
        Cell: ({ row }: any) =>
          row.original.output_addresses.map((a: string) => (
            <div key={a} style={{ whiteSpace: 'nowrap' }}>
              {getAddressLink(a)}
            </div>
          )),
      },
      {
        Header: 'Transaction',
        accessor: 'id',
        Cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {getTransactionLink(row.original.id)}
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getChainTransactions?.length) {
    return <DarkSubTitle>No onchain transactions found</DarkSubTitle>;
  }

  return (
    <Table withBorder={true} tableColumns={columns} tableData={tableData} />
  );
};
