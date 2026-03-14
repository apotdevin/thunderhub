import { useGetWalletInfoQuery } from '../../graphql/queries/__generated__/getWalletInfo.generated';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Badge } from '@/components/ui/badge';

export const WalletVersion = () => {
  const { data, loading, error } = useGetWalletInfoQuery();

  if (error) return null;

  if (loading || !data?.getWalletInfo) {
    return <LoadingCard />;
  }

  const {
    build_tags,
    is_autopilotrpc_enabled,
    is_chainrpc_enabled,
    is_invoicesrpc_enabled,
    is_signrpc_enabled,
    is_walletrpc_enabled,
    is_watchtowerrpc_enabled,
    is_wtclientrpc_enabled,
    commit_hash,
  } = data.getWalletInfo;

  const rpcServices = [
    { name: 'Autopilot', enabled: is_autopilotrpc_enabled },
    { name: 'Chain', enabled: is_chainrpc_enabled },
    { name: 'Invoices', enabled: is_invoicesrpc_enabled },
    { name: 'Signer', enabled: is_signrpc_enabled },
    { name: 'Wallet', enabled: is_walletrpc_enabled },
    { name: 'Watchtower', enabled: is_watchtowerrpc_enabled },
    { name: 'WTClient', enabled: is_wtclientrpc_enabled },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Wallet Version</h2>
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground">Commit</span>
              <span className="font-mono text-xs break-all">{commit_hash}</span>
              <span className="text-muted-foreground">Build Tags</span>
              <span className="break-words">{build_tags.join(', ')}</span>
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-sm font-medium">RPC Services</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {rpcServices.map(({ name, enabled }) => (
                  <Badge
                    key={name}
                    variant={enabled ? 'default' : 'outline'}
                    className={!enabled ? 'opacity-50' : ''}
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
