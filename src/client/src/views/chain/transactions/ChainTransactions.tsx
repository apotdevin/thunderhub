import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useGetChainTransactionsQuery } from '../../../graphql/queries/__generated__/getChainTransactions.generated';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import TableV2 from '../../../components/table-v2';
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
        header: 'Type',
        accessorKey: 'transaction_type',
        cell: ({ row }: any) => (
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
        header: 'Date',
        accessorKey: 'created_at',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${getDateDif(row.original.created_at)} ago`}
          </div>
        ),
      },
      {
        header: 'Sats',
        accessorKey: 'tokens',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.tokens} />
          </div>
        ),
      },
      {
        header: 'Fee',
        accessorKey: 'fee',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.fee} />
          </div>
        ),
      },
      { header: 'Confirmations', accessorKey: 'confirmation_count' },
      { header: 'Confirmation Block', accessorKey: 'confirmation_height' },
      {
        header: 'Output Addresses',
        accessorKey: 'output_addresses',
        enableSorting: false,
        cell: ({ row }: any) =>
          row.original.output_addresses.map((a: string) => (
            <div key={a} style={{ whiteSpace: 'nowrap' }}>
              {getAddressLink(a)}
            </div>
          )),
      },
      {
        header: 'Transaction',
        accessorKey: 'id',
        enableSorting: false,
        cell: ({ row }: any) => (
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
    <TableV2
      withBorder={true}
      columns={columns}
      data={tableData}
      withSorting={true}
    />
  );
};
