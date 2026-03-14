import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetChainTransactionsQuery } from '../../../graphql/queries/__generated__/getChainTransactions.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import Table from '../../../components/table';
import {
  getAddressLink,
  getDateDif,
  getTransactionLink,
} from '../../../components/generic/helpers';
import { Price } from '../../../components/price/Price';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useChartColors } from '../../../lib/chart-colors';

export const ChainTransactions = () => {
  const chartColors = useChartColors();

  const { loading, data } = useGetChainTransactionsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getChainTransactions || [];

    return channelData.map(c => ({
      ...c,
      transaction_type: c.fee !== null ? 'Sent' : 'Received',
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Type',
        accessorKey: 'transaction_type',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
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
          <div className="whitespace-nowrap">
            {`${getDateDif(row.original.created_at)} ago`}
          </div>
        ),
      },
      {
        header: 'Sats',
        accessorKey: 'tokens',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap font-mono">
            <Price amount={row.original.tokens} />
          </div>
        ),
      },
      {
        header: 'Fee',
        accessorKey: 'fee',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap font-mono">
            <Price amount={row.original.fee} />
          </div>
        ),
      },
      { header: 'Confirmations', accessorKey: 'confirmation_count' },
      { header: 'Block Height', accessorKey: 'confirmation_height' },
      {
        header: 'Output Addresses',
        accessorKey: 'output_addresses',
        enableSorting: false,
        cell: ({ row }: any) =>
          row.original.output_addresses.map((a: string) => (
            <div key={a} className="whitespace-nowrap">
              {getAddressLink(a)}
            </div>
          )),
      },
      {
        header: 'Transaction',
        accessorKey: 'id',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {getTransactionLink(row.original.id)}
          </div>
        ),
      },
    ],
    [chartColors]
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getChainTransactions?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <ArrowUpDown size={24} className="mb-2 opacity-50" />
        <span className="text-sm">No on-chain transactions found</span>
      </div>
    );
  }

  return <Table columns={columns} data={tableData} withSorting={true} />;
};
