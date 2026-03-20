import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  Trash2,
  RefreshCw,
  Plus,
  Globe,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetTapFederationServersQuery } from '../../graphql/queries/__generated__/getTapFederationServers.generated';
import {
  useAddTapFederationServerMutation,
  useRemoveTapFederationServerMutation,
  useSyncTapUniverseMutation,
} from '../../graphql/mutations/__generated__/manageTapUniverse.generated';
import { getErrorContent } from '../../utils/error';

export const UniverseManager: FC = () => {
  const [newHost, setNewHost] = useState('');
  const [copied, setCopied] = useState(false);

  const { data, loading, refetch } = useGetTapFederationServersQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [addServer, { loading: adding }] = useAddTapFederationServerMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Federation server added');
      setNewHost('');
      refetch();
    },
  });

  const [removeServer, { loading: removing }] =
    useRemoveTapFederationServerMutation({
      onError: error => toast.error(getErrorContent(error)),
      onCompleted: () => {
        toast.success('Federation server removed');
        refetch();
      },
    });

  const [syncUniverse, { loading: syncing }] = useSyncTapUniverseMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const count = data.syncTapUniverse?.syncedUniverses?.length || 0;
      toast.success(`Synced ${count} universe(s)`);
    },
  });

  const nodeAddress = data?.getTapFederationServers?.nodeAddress;
  const servers = data?.getTapFederationServers?.servers || [];

  const handleCopyNodeAddress = () => {
    if (nodeAddress) {
      navigator.clipboard.writeText(nodeAddress);
      setCopied(true);
      toast.success('Universe address copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Universe Federation Servers</h3>

      {nodeAddress && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                Your universe server address
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono flex-1 truncate">
                  {nodeAddress}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopyNodeAddress}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Share this with others so they can sync your universe and
                receive your assets
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHost}
              onChange={e => setNewHost(e.target.value)}
              placeholder="universe.example.com:10029"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
            <Button
              onClick={() => addServer({ variables: { host: newHost } })}
              disabled={adding || !newHost}
              size="sm"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              <span className="ml-1">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        </div>
      ) : servers.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Globe className="mr-2" size={16} />
          No federation servers configured
        </div>
      ) : (
        <div className="grid gap-2">
          {servers.map((server, i) => (
            <Card key={`${server.host}-${i}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono">{server.host}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        syncUniverse({ variables: { host: server.host } })
                      }
                      disabled={syncing}
                      title="Sync"
                    >
                      <RefreshCw
                        size={14}
                        className={syncing ? 'animate-spin' : ''}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeServer({ variables: { host: server.host } })
                      }
                      disabled={removing}
                      title="Remove"
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
