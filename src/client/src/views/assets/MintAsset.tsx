import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMintTapAssetMutation } from '../../graphql/mutations/__generated__/mintTapAsset.generated';
import { useFinalizeTapBatchMutation } from '../../graphql/mutations/__generated__/finalizeTapBatch.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { TapAssetType, TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

export const MintAsset: FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [precision, setPrecision] = useState('');
  const [assetType, setAssetType] = useState(TapAssetType.Normal);
  const [grouped, setGrouped] = useState(true);
  const [groupKey, setGroupKey] = useState('');
  const [batchKey, setBatchKey] = useState<string | null>(null);

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const existingGroups = (
    balancesData?.taproot_assets?.get_balances?.balances || []
  )
    .filter(b => b.group_key)
    .map(b => ({
      key: b.group_key!,
      name: b.names?.[0] || 'Unknown',
    }));

  const [mintAsset, { loading: minting }] = useMintTapAssetMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const key = data.taproot_assets?.mint_asset?.batch_key;
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
      setPrecision('');
      setGrouped(true);
      setGroupKey('');
    },
    refetchQueries: ['GetTapAssets', 'GetTapBalances'],
  });

  const handleMint = () => {
    if (!name || !amount || precision === '') {
      toast.error('Name, amount, and precision are required');
      return;
    }
    const parsedPrecision = Number(precision);
    if (
      !Number.isInteger(parsedPrecision) ||
      parsedPrecision < 0 ||
      parsedPrecision > 18
    ) {
      toast.error('Precision must be an integer between 0 and 18');
      return;
    }
    mintAsset({
      variables: {
        input: {
          name,
          amount,
          asset_type: assetType,
          grouped,
          group_key: groupKey || null,
          precision: parsedPrecision,
        },
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
              value={grouped ? groupKey || '__new__' : '__none__'}
              onChange={e => {
                const val = e.target.value;
                if (val === '__none__') {
                  setGrouped(false);
                  setGroupKey('');
                } else if (val === '__new__') {
                  setGrouped(true);
                  setGroupKey('');
                } else {
                  setGrouped(true);
                  setGroupKey(val);
                }
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="__none__">No group</option>
              <option value="__new__">Create new group</option>
              {existingGroups.map(g => (
                <option key={g.key} value={g.key}>
                  {g.name} ({g.key.slice(0, 16)}...)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Asset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="my-asset"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
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
              Precision
            </label>
            <input
              type="number"
              value={precision}
              onChange={e => setPrecision(e.target.value)}
              min={0}
              max={18}
              step={1}
              placeholder="e.g. 2 for cent-like units"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of decimal places to display. 0–18.
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Type
            </label>
            <select
              value={assetType}
              onChange={e => setAssetType(e.target.value as TapAssetType)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value={TapAssetType.Normal}>Normal</option>
              <option value={TapAssetType.Collectible}>Collectible</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMint}
              disabled={minting || !name || !amount || precision === ''}
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
