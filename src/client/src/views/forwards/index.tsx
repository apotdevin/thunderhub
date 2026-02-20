import { FC, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  getChannelLink,
  getDateDif,
  getNodeLink,
} from '../../components/generic/helpers';
import { DarkSubTitle } from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../utils/error';
import Table from '../../components/table';
import { useChannelInfo } from '../../hooks/UseChannelInfo';

type ForwardProps = {
  days: number;
};

const ChannelPeer: FC<{ channel: string }> = ({ channel }) => {
  const {
    peer: { alias, pubkey },
  } = useChannelInfo(channel);

  return <div>{getNodeLink(pubkey, alias)}</div>;
};

export const ForwardsList: FC<ForwardProps> = ({ days }) => {
  const { loading, data } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const tableData = useMemo(() => {
    const channelData = data?.getForwards.list || [];

    return channelData.map(c => {
      return {
        ...c,
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
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
        columns: [
          {
            header: 'Forwarded',
            accessorKey: 'tokens',
            cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.tokens} />
              </div>
            ),
          },
          {
            header: 'Earned',
            accessorKey: 'fee',
            cell: ({ row }: any) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Price amount={row.original.fee_mtokens / 1000} />
              </div>
            ),
          },
        ],
      },
      {
        header: 'Peer',
        columns: [
          {
            header: 'Incoming',
            accessorKey: 'incoming_name',
            cell: ({ row }: any) => (
              <ChannelPeer channel={row.original.incoming_channel} />
            ),
          },
          {
            header: 'Outgoing',
            accessorKey: 'outgoing_name',
            cell: ({ row }: any) => (
              <ChannelPeer channel={row.original.outgoing_channel} />
            ),
          },
        ],
      },
      {
        header: 'Channel',
        columns: [
          {
            header: 'Incoming',
            accessorKey: 'incoming_channel',
            cell: ({ row }: any) =>
              getChannelLink(row.original.incoming_channel),
          },
          {
            header: 'Outgoing',
            accessorKey: 'outgoing_channel',
            cell: ({ row }: any) =>
              getChannelLink(row.original.outgoing_channel),
          },
        ],
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !data.getForwards.list.length) {
    return <DarkSubTitle>No forwards found</DarkSubTitle>;
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
