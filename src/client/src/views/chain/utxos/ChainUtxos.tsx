import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetUtxosQuery } from '../../../graphql/queries/__generated__/getUtxos.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import Table from '../../../components/table';
import { getAddressLink } from '../../../components/generic/helpers';
import { Price } from '../../../components/price/Price';
import { blockToTime } from '../../../utils/helpers';
import { Coins } from 'lucide-react';

export const ChainUtxos = () => {
  const { loading, data } = useGetUtxosQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getUtxos || [];

    return channelData.map((c, index) => ({
      ...c,
      index: index + 1,
      time: blockToTime(c.confirmation_count),
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: '#',
        accessorKey: 'index',
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
      { header: 'Confirmations', accessorKey: 'confirmation_count' },
      {
        header: 'Since',
        accessorKey: 'time',
      },
      {
        header: 'Address',
        enableSorting: false,
        accessorKey: 'output_addresses',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {getAddressLink(row.original.address)}
          </div>
        ),
      },
      {
        header: 'Format',
        enableSorting: false,
        accessorKey: 'address_format',
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getUtxos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Coins size={24} className="mb-2 opacity-50" />
        <span className="text-sm">No UTXOs found</span>
      </div>
    );
  }

  return <Table columns={columns} data={tableData} withSorting={true} />;
};
