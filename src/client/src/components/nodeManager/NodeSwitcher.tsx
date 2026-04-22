import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronsUpDown,
  Plus,
  Server,
  Check,
  Pencil,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNodeSlug } from '@/hooks/useNodeSlug';
import { useGetUserNodesQuery } from '@/graphql/queries/__generated__/getUserNodes.generated';
import { useGetAccountQuery } from '@/graphql/queries/__generated__/getAccount.generated';
import { useDeleteNodeMutation } from '@/graphql/mutations/__generated__/deleteNode.generated';
import { GetUserNodesDocument } from '@/graphql/queries/__generated__/getUserNodes.generated';
import { getErrorContent } from '@/utils/error';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AddNodeDialog } from './AddNodeDialog';
import { EditNodeDialog } from './EditNodeDialog';

export const NodeSwitcher = () => {
  const navigate = useNavigate();
  const { nodeSlug } = useNodeSlug();
  const [open, setOpen] = useState(false);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [editNode, setEditNode] = useState<{
    slug: string;
    name: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: accountData } = useGetAccountQuery({
    fetchPolicy: 'cache-first',
  });

  const isDbUser = accountData?.getAccount?.type === 'db';

  const { data, loading } = useGetUserNodesQuery({
    skip: !isDbUser,
    fetchPolicy: 'cache-and-network',
  });

  const [deleteNodeMutation, { loading: deleting }] = useDeleteNodeMutation({
    refetchQueries: [{ query: GetUserNodesDocument }],
  });

  if (!isDbUser) return null;

  const nodes = data?.user?.get_nodes ?? [];

  const currentNode = nodes.find(n => n.slug === nodeSlug);
  const currentName = currentNode?.name ?? accountData?.getAccount?.name ?? '';

  const networkLabel = (network?: string | null) => {
    if (!network) return 'Unknown';
    const labels: Record<string, string> = {
      btc: 'Mainnet',
      mainnet: 'Mainnet',
      btctestnet: 'Testnet',
      btctestnet4: 'Testnet4',
      btcsignet: 'Signet',
      btcregtest: 'Regtest',
    };
    return labels[network] ?? network;
  };

  const networkBadgeClass = (network?: string | null) => {
    const label = networkLabel(network);
    const styles: Record<string, string> = {
      Mainnet: 'bg-amber-500/15 text-amber-500',
      Signet: 'bg-purple-500/15 text-purple-500',
      Testnet: 'bg-green-500/15 text-green-500',
      Testnet4: 'bg-green-500/15 text-green-500',
      Regtest: 'bg-slate-500/15 text-slate-500',
    };
    return styles[label] ?? 'bg-muted text-muted-foreground';
  };

  const groupedByNetwork = nodes.reduce<Record<string, typeof nodes>>(
    (acc, node) => {
      const key = networkLabel(node.network);
      if (!acc[key]) acc[key] = [];
      acc[key].push(node);
      return acc;
    },
    {}
  );

  const networkOrder = [
    'Mainnet',
    'Signet',
    'Testnet',
    'Testnet4',
    'Regtest',
    'Unknown',
  ];
  const sortedNetworks = Object.keys(groupedByNetwork).sort(
    (a, b) =>
      (networkOrder.indexOf(a) === -1 ? 99 : networkOrder.indexOf(a)) -
      (networkOrder.indexOf(b) === -1 ? 99 : networkOrder.indexOf(b))
  );

  const hasMultipleNetworks = sortedNetworks.length > 1;

  const handleSwitch = (slug: string) => {
    setOpen(false);
    if (slug !== nodeSlug) {
      navigate(`/${slug}/home`);
    }
  };

  const handleNodeAdded = (slug: string) => {
    setAddNodeOpen(false);
    navigate(`/${slug}/home`);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteNodeMutation({ variables: { slug } });
      toast.success('Node deleted');
      setConfirmDelete(null);

      if (slug === nodeSlug) {
        const remaining = nodes.filter(n => n.slug !== slug);
        if (remaining.length > 0) {
          navigate(`/${remaining[0].slug}/home`);
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      toast.error(getErrorContent(err));
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Server size={12} className="shrink-0" />
            <span className="max-w-30 truncate">{currentName}</span>
            {currentNode?.type && (
              <span
                className={cn(
                  'shrink-0 rounded px-1 py-0.5 text-[9px] font-medium uppercase',
                  currentNode.type === 'litd'
                    ? 'bg-teal-500/15 text-teal-500'
                    : 'bg-blue-500/15 text-blue-500'
                )}
              >
                {currentNode.type}
              </span>
            )}
            {currentNode?.network && (
              <span
                className={cn(
                  'shrink-0 rounded px-1 py-0.5 text-[9px] font-medium uppercase',
                  networkBadgeClass(currentNode.network)
                )}
              >
                {networkLabel(currentNode.network)}
              </span>
            )}
            <ChevronsUpDown size={12} className="shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-0">
          <div className="p-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
              Your Nodes
            </div>
            {loading && nodes.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                Loading...
              </div>
            ) : nodes.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No nodes connected
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {sortedNetworks.map(network => (
                  <div key={network}>
                    {hasMultipleNetworks && (
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 pt-2 pb-0.5">
                        {network}
                      </div>
                    )}
                    {groupedByNetwork[network].map(node => (
                      <div key={node.slug} className="group flex items-center">
                        <button
                          onClick={() => handleSwitch(node.slug)}
                          className={cn(
                            'flex items-center gap-2 flex-1 min-w-0 rounded-sm px-2 py-1.5 text-left text-xs transition-colors',
                            node.slug === nodeSlug
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground hover:bg-accent'
                          )}
                        >
                          <Server size={12} className="shrink-0" />
                          <span className="flex-1 truncate">{node.name}</span>
                          {node.type && (
                            <span
                              className={cn(
                                'shrink-0 rounded px-1 py-0.5 text-[9px] font-medium uppercase',
                                node.type === 'litd'
                                  ? 'bg-teal-500/15 text-teal-500'
                                  : 'bg-blue-500/15 text-blue-500'
                              )}
                            >
                              {node.type}
                            </span>
                          )}
                          {node.slug === nodeSlug && (
                            <Check size={12} className="shrink-0" />
                          )}
                        </button>
                        <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setOpen(false);
                              setEditNode({
                                slug: node.slug,
                                name: node.name,
                              });
                            }}
                            className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            title="Edit node"
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setConfirmDelete(node.slug);
                            }}
                            className="p-1 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete node"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {confirmDelete && (
            <div className="border-t border-border/60 p-2">
              <div className="text-xs text-destructive font-medium px-2 py-1">
                Delete{' '}
                <span className="font-semibold">
                  {nodes.find(n => n.slug === confirmDelete)?.name ??
                    confirmDelete}
                </span>
                ?
              </div>
              <div className="flex gap-1 px-2 pt-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-6 text-[10px] flex-1"
                  disabled={deleting}
                  onClick={() => handleDelete(confirmDelete)}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] flex-1"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="border-t border-border/60 p-2">
            <button
              onClick={() => {
                setOpen(false);
                setAddNodeOpen(true);
              }}
              className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-left text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Plus size={12} className="shrink-0" />
              <span>Add Node</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        onNodeAdded={handleNodeAdded}
      />

      <EditNodeDialog
        open={!!editNode}
        onOpenChange={open => {
          if (!open) setEditNode(null);
        }}
        node={editNode}
      />
    </>
  );
};
