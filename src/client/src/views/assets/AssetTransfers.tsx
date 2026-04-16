import { FC } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTapTransfersQuery } from '../../graphql/queries/__generated__/getTapTransfers.generated';
import { getErrorContent } from '../../utils/error';

export const AssetTransfers: FC = () => {
  const { data, loading, error } = useGetTapTransfersQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        Unable to load transfers
      </div>
    );
  }

  const transfers = data?.taproot_assets?.get_transfers?.transfers || [];

  if (transfers.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Info className="mr-2" size={16} />
        No transfers yet
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {transfers.map((transfer, i) => {
        const totalIn = (transfer.inputs || []).reduce(
          (sum, inp) => sum + Number(inp.amount || 0),
          0
        );
        const totalOut = (transfer.outputs || [])
          .filter(o => !o.script_key_is_local)
          .reduce((sum, out) => sum + Number(out.amount || 0), 0);

        return (
          <Card key={`${transfer.anchor_tx_hash}-${i}`}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono truncate max-w-[400px]">
                    {transfer.anchor_tx_hash}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {transfer.transfer_timestamp
                      ? new Date(
                          Number(transfer.transfer_timestamp) * 1000
                        ).toLocaleString()
                      : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    {(transfer.inputs || []).map((inp, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-1 text-muted-foreground"
                      >
                        <span className="font-mono truncate max-w-[120px]">
                          {inp.asset_id?.slice(0, 12)}...
                        </span>
                        <span className="font-semibold text-foreground">
                          {inp.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ArrowRight size={12} className="text-muted-foreground" />

                  <div className="flex flex-col gap-1">
                    {(transfer.outputs || []).map((out, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span className="font-mono text-muted-foreground truncate max-w-[120px]">
                          {out.asset_id?.slice(0, 12)}...
                        </span>
                        <span className="font-semibold">{out.amount}</span>
                        {out.script_key_is_local && (
                          <span className="text-[10px] bg-muted px-1 rounded">
                            local
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {transfer.anchor_tx_chain_fees && (
                  <div className="text-[10px] text-muted-foreground">
                    Chain fee: {transfer.anchor_tx_chain_fees} sats
                    {totalOut > 0 && ` · Sent: ${totalOut}`}
                    {totalIn > 0 && ` · Input: ${totalIn}`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
