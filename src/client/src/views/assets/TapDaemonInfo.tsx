import { FC } from 'react';
import { Loader2, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTapInfoQuery } from '../../graphql/queries/__generated__/getTapInfo.generated';

export const TapDaemonInfo: FC = () => {
  const { data, loading, error } = useGetTapInfoQuery({
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        Loading daemon info...
      </div>
    );
  }

  if (error || !data?.taproot_assets?.get_info) {
    return (
      <div className="text-sm text-muted-foreground">
        Daemon info unavailable
      </div>
    );
  }

  const info = data.taproot_assets.get_info;

  const rows: { label: string; value: string | number | boolean }[] = [
    { label: 'Version', value: info.version },
    { label: 'LND Version', value: info.lnd_version },
    { label: 'Network', value: info.network },
    { label: 'Node Alias', value: info.node_alias },
    { label: 'Identity Pubkey', value: info.lnd_identity_pubkey },
    { label: 'Block Height', value: info.block_height },
    { label: 'Block Hash', value: info.block_hash },
    { label: 'Synced to Chain', value: info.sync_to_chain },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Info size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold">Daemon Info</h3>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3">
            {rows.map(row => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <span className="text-muted-foreground shrink-0">
                  {row.label}
                </span>
                {typeof row.value === 'boolean' ? (
                  row.value ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )
                ) : (
                  <span className="font-mono text-right break-all">
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
