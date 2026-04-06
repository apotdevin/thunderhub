import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronsUpDown, Plus, Server, Check } from 'lucide-react';
import { useNodeSlug } from '@/hooks/useNodeSlug';
import { useGetUserNodesQuery } from '@/graphql/queries/__generated__/getUserNodes.generated';
import { useGetAccountQuery } from '@/graphql/queries/__generated__/getAccount.generated';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AddNodeDialog } from './AddNodeDialog';

export const NodeSwitcher = () => {
  const navigate = useNavigate();
  const { nodeSlug } = useNodeSlug();
  const [open, setOpen] = useState(false);
  const [addNodeOpen, setAddNodeOpen] = useState(false);

  const { data: accountData } = useGetAccountQuery({
    fetchPolicy: 'cache-first',
  });

  const isDbUser = accountData?.getAccount?.type === 'db';

  const { data, loading } = useGetUserNodesQuery({
    skip: !isDbUser,
    fetchPolicy: 'cache-and-network',
  });

  if (!isDbUser) return null;

  const nodes = data?.user?.get_nodes ?? [];

  const currentNode = nodes.find(n => n.slug === nodeSlug);
  const currentName = currentNode?.name ?? accountData?.getAccount?.name ?? '';

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
            <span className="max-w-[120px] truncate">{currentName}</span>
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
                {nodes.map(node => (
                  <button
                    key={node.slug}
                    onClick={() => handleSwitch(node.slug)}
                    className={cn(
                      'flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-left text-xs transition-colors',
                      node.slug === nodeSlug
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <Server size={12} className="shrink-0" />
                    <span className="flex-1 truncate">{node.name}</span>
                    {node.slug === nodeSlug && (
                      <Check size={12} className="shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
    </>
  );
};
