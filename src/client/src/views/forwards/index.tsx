import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getDateDif } from '../../components/generic/helpers';
import { DarkSubTitle } from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { Table } from '../../components/table';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../utils/error';
import { ChannelAlias } from '../home/reports/forwardReport/ChannelAlias';

type ForwardProps = {
  days: number;
};

export const ForwardsList: FC<ForwardProps> = ({ days }) => {
  const { loading, data } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getForwards || [];

    return channelData.map(c => {
      return {
        ...c,
        incoming_name: <ChannelAlias id={c.incoming_channel} />,
        outgoing_name: <ChannelAlias id={c.outgoing_channel} />,
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
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
        columns: [
          {
            Header: 'Forwarded',
            accessor: 'tokens',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.tokens} />
              </div>
            ),
          },
          {
            Header: 'Earned',
            accessor: 'fee',
            Cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.fee} />
              </div>
            ),
          },
        ],
      },
      {
        Header: 'Peer',
        columns: [
          {
            Header: 'Incoming',
            accessor: 'incoming_name',
          },
          {
            Header: 'Outgoing',
            accessor: 'outgoing_name',
          },
        ],
      },
      {
        Header: 'Channel',
        columns: [
          {
            Header: 'Incoming',
            accessor: 'incoming_channel',
          },
          {
            Header: 'Outgoing',
            accessor: 'outgoing_channel',
          },
        ],
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !data.getForwards?.length) {
    return <DarkSubTitle>No forwards found</DarkSubTitle>;
  }

  return (
    <Table withBorder={true} tableColumns={columns} tableData={tableData} />
  );
};
