import { FC, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getChannelLink,
  getDateDif,
  getNodeLink,
} from '../../components/generic/helpers';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetForwardsListQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../utils/error';
import Table from '../../components/table';
import { useChannelInfo } from '../../hooks/UseChannelInfo';
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { numberWithCommas } from '../../utils/number';

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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    setPage(0);
  }, [days]);

  const { loading, data } = useGetForwardsListQuery({
    variables: {
      days,
      limit: pageSize,
      offset: page * pageSize,
    },
    onError: error => toast.error(getErrorContent(error)),
  });

  const totalCount = data?.getForwards?.summary?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalCount);

  const tableData = useMemo(() => {
    const channelData = data?.getForwards?.list || [];
    return channelData.map(c => ({ ...c }));
  }, [data]);

  const columns = useMemo(
    () => [
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
        columns: [
          {
            header: 'Forwarded',
            accessorKey: 'tokens',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap font-mono">
                <Price amount={row.original.tokens} />
              </div>
            ),
          },
          {
            header: 'Earned',
            accessorKey: 'fee',
            cell: ({ row }: any) => (
              <div className="whitespace-nowrap font-mono">
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

  if (loading && !data) {
    return <LoadingCard noCard={true} />;
  }

  if (!loading && (!data || !data?.getForwards?.list?.length)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <ArrowRightLeft size={24} className="mb-2 opacity-50" />
        <span className="text-sm">No forwards found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Table columns={columns} data={tableData} withSorting={true} />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
        <div>
          Showing{' '}
          <span className="font-medium text-foreground">{startItem}</span> to{' '}
          <span className="font-medium text-foreground">{endItem}</span> of{' '}
          <span className="font-medium text-foreground">
            {totalCount > 0 ? numberWithCommas(totalCount) : '0'}
          </span>{' '}
          forwards
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(0)}
              disabled={page === 0 || loading}
              className="h-7 px-2"
              title="First Page"
            >
              <ChevronsLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="h-7 px-2"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="px-2 font-medium text-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || loading}
              className="h-7 px-2"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1 || loading}
              className="h-7 px-2"
              title="Last Page"
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
