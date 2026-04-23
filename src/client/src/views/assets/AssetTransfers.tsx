import { FC } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Inputs</TableHead>
              <TableHead>Outputs</TableHead>
              <TableHead className="text-right">Fees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer, i) => (
              <TableRow key={`${transfer.anchor_tx_hash}-${i}`}>
                <TableCell>
                  <span className="font-mono truncate max-w-40 block">
                    {transfer.anchor_tx_hash?.slice(0, 16)}...
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transfer.transfer_timestamp
                    ? new Date(
                        Number(transfer.transfer_timestamp) * 1000
                      ).toLocaleString()
                    : 'Pending'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {(transfer.inputs || []).map((inp, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span className="font-mono text-muted-foreground">
                          {inp.asset_id?.slice(0, 12)}...
                        </span>
                        <span className="font-semibold">{inp.amount}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {(transfer.outputs || []).map((out, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span className="font-mono text-muted-foreground">
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
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {transfer.anchor_tx_chain_fees
                    ? `${transfer.anchor_tx_chain_fees} sats`
                    : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
