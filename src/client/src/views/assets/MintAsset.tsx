import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMintTapAssetMutation } from '../../graphql/mutations/__generated__/mintTapAsset.generated';
import { useFinalizeTapBatchMutation } from '../../graphql/mutations/__generated__/finalizeTapBatch.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { getErrorContent } from '../../utils/error';

export const MintAsset: FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [assetType, setAssetType] = useState<'NORMAL' | 'COLLECTIBLE'>(
    'NORMAL'
  );
  const [groupKey, setGroupKey] = useState('');
  const [batchKey, setBatchKey] = useState<string | null>(null);

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: 'groupKey' },
  });

  const existingGroups = (balancesData?.getTapBalances?.balances || [])
    .filter(b => b.groupKey)
    .map(b => ({ key: b.groupKey!, name: b.name || 'Unknown' }));

  const [mintAsset, { loading: minting }] = useMintTapAssetMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const key = data.mintTapAsset?.batchKey;
      if (key) {
        setBatchKey(key);
        toast.success('Asset added to batch');
      }
    },
  });

  const [finalizeBatch, { loading: finalizing }] = useFinalizeTapBatchMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Batch finalized! Mining will confirm the assets.');
      setBatchKey(null);
      setName('');
      setAmount('');
      setGroupKey('');
    },
    refetchQueries: ['GetTapAssets', 'GetTapBalances'],
  });

  const handleMint = () => {
    if (!name || !amount) {
      toast.error('Name and amount are required');
      return;
    }
    mintAsset({
      variables: {
        name,
        amount: parseInt(amount, 10),
        assetType,
        groupKey: groupKey || null,
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Mint New Asset</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Group
            </label>
            <select
              value={groupKey}
              onChange={e => setGroupKey(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Create new group</option>
              {existingGroups.map(g => (
                <option key={g.key} value={g.key}>
                  {g.name} ({g.key.slice(0, 16)}...)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {groupKey ? 'Asset Name' : 'Asset & Group Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={groupKey ? 'my-asset' : 'my-asset-group'}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {!groupKey && (
              <p className="text-[10px] text-muted-foreground mt-1">
                This name identifies both the asset and the new group
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Type
            </label>
            <select
              value={assetType}
              onChange={e =>
                setAssetType(e.target.value as 'NORMAL' | 'COLLECTIBLE')
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="NORMAL">Normal</option>
              <option value="COLLECTIBLE">Collectible</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMint}
              disabled={minting || !name || !amount}
              size="sm"
            >
              {minting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Batch
            </Button>
            {batchKey && (
              <Button
                onClick={() => finalizeBatch()}
                disabled={finalizing}
                variant="secondary"
                size="sm"
              >
                {finalizing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Finalize Batch
              </Button>
            )}
          </div>
          {batchKey && (
            <p className="text-xs text-muted-foreground">
              Batch key: <span className="font-mono">{batchKey}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
