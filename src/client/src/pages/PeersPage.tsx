import { useMemo, useState } from 'react';
import {
  Trash2,
  Globe,
  Shield,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
} from 'lucide-react';
import { useGetPeersQuery } from '../graphql/queries/__generated__/getPeers.generated';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { LoadingCard } from '../components/loading/LoadingCard';
import { AddPeer } from '../views/peers/AddPeer';
import { getNodeLink } from '../components/generic/helpers';
import { Price } from '../components/price/Price';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RemovePeerModal } from '../components/modal/removePeer/RemovePeer';
import Modal from '../components/modal/ReactModal';
import Table from '../components/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
};

const PeersView = () => {
  const { loading, data } = useGetPeersQuery();
  const [removePeer, setRemovePeer] = useState<{
    publicKey: string;
    alias: string;
  } | null>(null);
  const [addPeerOpen, setAddPeerOpen] = useState(false);

  const tableData = useMemo(() => {
    const peers = data?.getPeers || [];
    return peers.map(p => ({
      ...p,
      alias: p.partner_node_info.node?.alias || 'Unknown',
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Peer',
        accessorKey: 'alias',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap font-medium">
            {getNodeLink(row.original.public_key, row.original.alias)}
          </div>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'is_sync_peer',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap">
            {row.original.is_sync_peer ? (
              <Badge variant="default">Sync</Badge>
            ) : (
              <Badge variant="secondary">Standard</Badge>
            )}
          </div>
        ),
      },
      {
        header: 'Network',
        accessorKey: 'socket',
        cell: ({ row }: any) => {
          const isTor = row.original.socket.includes('.onion');
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="whitespace-nowrap inline-flex items-center gap-1.5">
                    {isTor ? (
                      <Shield size={14} className="text-purple-500" />
                    ) : (
                      <Globe size={14} className="text-blue-500" />
                    )}
                    <span>{isTor ? 'Tor' : 'Clearnet'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{row.original.socket}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        header: 'Ping',
        accessorKey: 'ping_time',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap tabular-nums">
            {row.original.ping_time} ms
          </div>
        ),
      },
      {
        header: () => (
          <span className="inline-flex items-center gap-1">
            <ArrowDownToLine size={13} /> Received
          </span>
        ),
        accessorKey: 'tokens_received',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap tabular-nums">
            <Price amount={row.original.tokens_received} />
          </div>
        ),
      },
      {
        header: () => (
          <span className="inline-flex items-center gap-1">
            <ArrowUpFromLine size={13} /> Sent
          </span>
        ),
        accessorKey: 'tokens_sent',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap tabular-nums">
            <Price amount={row.original.tokens_sent} />
          </div>
        ),
      },
      {
        header: 'Traffic In',
        accessorKey: 'bytes_received',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap tabular-nums text-muted-foreground">
            {formatBytes(row.original.bytes_received)}
          </div>
        ),
      },
      {
        header: 'Traffic Out',
        accessorKey: 'bytes_sent',
        cell: ({ row }: any) => (
          <div className="whitespace-nowrap tabular-nums text-muted-foreground">
            {formatBytes(row.original.bytes_sent)}
          </div>
        ),
      },
      {
        header: '',
        id: 'actions',
        cell: ({ row }: any) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() =>
                setRemovePeer({
                  publicKey: row.original.public_key,
                  alias: row.original.alias,
                })
              }
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">
          Peers
          {tableData.length > 0 && (
            <Badge variant="secondary" className="ml-2 min-w-5 justify-center">
              {tableData.length}
            </Badge>
          )}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddPeerOpen(true)}
          >
            <Plus className="mr-1 size-4" />
            Add Peer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {!data || !data.getPeers?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No peers connected</p>
            </div>
          ) : (
            <Table
              withBorder={true}
              columns={columns}
              data={tableData}
              withSorting={true}
              withGlobalSort={true}
              filterPlaceholder="peers"
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={addPeerOpen}
        onOpenChange={open => !open && setAddPeerOpen(false)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Peer</DialogTitle>
            <DialogDescription>
              Connect to a new Lightning Network peer.
            </DialogDescription>
          </DialogHeader>
          <AddPeer closeCbk={() => setAddPeerOpen(false)} />
        </DialogContent>
      </Dialog>

      <Modal isOpen={!!removePeer} closeCallback={() => setRemovePeer(null)}>
        {removePeer && (
          <RemovePeerModal
            setModalOpen={() => setRemovePeer(null)}
            publicKey={removePeer.publicKey}
            peerAlias={removePeer.alias}
          />
        )}
      </Modal>
    </div>
  );
};

const PeersPage = () => (
  <GridWrapper centerContent={false}>
    <PeersView />
  </GridWrapper>
);

export default PeersPage;
