import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBurnTapAssetMutation } from '../../graphql/mutations/__generated__/burnTapAsset.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { getErrorContent } from '../../utils/error';

export const BurnAsset: FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const { data: assetBalances } = useGetTapBalancesQuery({
    variables: { groupBy: 'assetId' },
  });

  const { data: groupBalances } = useGetTapBalancesQuery({
    variables: { groupBy: 'groupKey' },
  });

  // Merge: prefer assetId balances, enrich with group names
  const groupNameMap = new Map(
    (groupBalances?.getTapBalances?.balances || [])
      .filter(b => b.assetId)
      .map(b => [b.assetId!, b.name || 'Unknown'])
  );

  const knownAssets = (assetBalances?.getTapBalances?.balances || [])
    .filter(b => b.assetId && b.balance && Number(b.balance) > 0)
    .map(b => ({
      assetId: b.assetId!,
      name: b.name || groupNameMap.get(b.assetId!) || 'Unknown',
      balance: b.balance!,
    }));

  const selectedBalance = knownAssets.find(
    a => a.assetId === selectedAsset
  )?.balance;

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
    burnAsset({
      variables: { assetId: selectedAsset, amount: parseInt(amount, 10) },
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
                  {a.name} (balance: {a.balance})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Amount to burn
              {selectedBalance && (
                <span className="ml-1">(max: {selectedBalance})</span>
              )}
            </label>
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
