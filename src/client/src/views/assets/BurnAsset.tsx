import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBurnTapAssetMutation } from '../../graphql/mutations/__generated__/burnTapAsset.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';
import { formatAssetAmount } from '../../utils/helpers';
import { displayToAtomic } from './trade.helpers';

export const BurnAsset: FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const { data: assetBalances } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.AssetId },
  });

  const knownAssets = (
    assetBalances?.taproot_assets?.get_balances?.balances || []
  )
    .filter(b => b.asset_id && b.balance && Number(b.balance) > 0)
    .map(b => ({
      assetId: b.asset_id!,
      name: b.names?.[0] || 'Unknown',
      balance: b.balance!,
      precision: b.precision,
    }));

  const selectedAsset$ = knownAssets.find(a => a.assetId === selectedAsset);
  const selectedBalance = selectedAsset$?.balance;
  const selectedPrecision = selectedAsset$?.precision ?? 0;

  const [burnAsset, { loading }] = useBurnTapAssetMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Asset burned successfully');
      setSelectedAsset('');
      setAmount('');
      setConfirmed(false);
    },
    refetchQueries: ['GetTapAssets', 'GetTapBalances'],
  });

  const handleBurn = () => {
    if (!selectedAsset || !amount || !confirmed) return;
    const atomicAmount = displayToAtomic(amount, selectedPrecision).toString();
    burnAsset({
      variables: { asset_id: selectedAsset, amount: atomicAmount },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Flame size={14} className="text-destructive" />
          Burn Asset
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Asset
            </label>
            <select
              value={selectedAsset}
              onChange={e => {
                setSelectedAsset(e.target.value);
                setConfirmed(false);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select an asset...</option>
              {knownAssets.map(a => (
                <option key={a.assetId} value={a.assetId}>
                  {a.name} (balance:{' '}
                  {formatAssetAmount(Number(a.balance), a.precision)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">
                Amount to burn
                {selectedBalance && (
                  <span className="ml-1">
                    (max:{' '}
                    {formatAssetAmount(
                      Number(selectedBalance),
                      selectedPrecision
                    )}
                    )
                  </span>
                )}
              </label>
              {amount && (
                <span className="text-[11px] text-muted-foreground">
                  {displayToAtomic(amount, selectedPrecision).toLocaleString()}{' '}
                  atomic units
                </span>
              )}
            </div>
            <input
              type="number"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
                setConfirmed(false);
              }}
              placeholder="Amount"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {selectedAsset && amount && (
            <label className="flex items-center gap-2 text-xs text-destructive">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="rounded"
              />
              I understand this is irreversible and will destroy {amount} units
            </label>
          )}
          <Button
            onClick={handleBurn}
            disabled={loading || !selectedAsset || !amount || !confirmed}
            variant="destructive"
            size="sm"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Burn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
