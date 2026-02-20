import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetUtxosQuery } from '../../../graphql/queries/__generated__/getUtxos.generated';
import { DarkSubTitle } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import Table from '../../../components/table';
import { getAddressLink } from '../../../components/generic/helpers';
import { Price } from '../../../components/price/Price';
import { blockToTime } from '../../../utils/helpers';

export const ChainUtxos = () => {
  const { loading, data } = useGetUtxosQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getUtxos || [];

    return channelData.map((c, index) => {
      return {
        ...c,
        index: index + 1,
        time: blockToTime(c.confirmation_count),
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'index',
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
        header: 'Confirmations',
        columns: [
          { header: 'Blocks', accessorKey: 'confirmation_count' },
          {
            header: 'Since',
            accessorKey: 'time',
          },
        ],
      },
      {
        header: 'Address',
        enableSorting: false,
        columns: [
          {
            header: 'Link',
            enableSorting: false,
            accessorKey: 'output_addresses',
            cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
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
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getUtxos?.length) {
    return <DarkSubTitle>No Utxos found</DarkSubTitle>;
  }

  return (
    <Table
      withBorder={true}
      columns={columns}
      data={tableData}
      withSorting={true}
    />
  );
};
