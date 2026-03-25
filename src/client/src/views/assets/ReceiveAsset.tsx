import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNewTapAddressMutation } from '../../graphql/mutations/__generated__/newTapAddress.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapUniverseAssetsQuery } from '../../graphql/queries/__generated__/getTapUniverseAssets.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

type GroupEntry = {
  groupKey: string;
  name: string;
  source: 'owned' | 'universe';
};

export const ReceiveAsset: FC = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [customGroupKey, setCustomGroupKey] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedAddr, setGeneratedAddr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: TapBalanceGroupBy.GroupKey },
  });

  const { data: universeData } = useGetTapUniverseAssetsQuery();

  // Merge owned assets and universe assets, deduplicate by group key
  const ownedGroups = (balancesData?.getTapBalances?.balances || [])
    .filter(b => b.groupKey)
    .map(
      (b): GroupEntry => ({
        groupKey: b.groupKey!,
        name: b.names?.join(', ') || 'Unknown',
        source: 'owned',
      })
    );

  const universeGroups = (universeData?.getTapUniverseAssets?.assets || [])
    .filter(a => a.groupKey)
    .map(
      (a): GroupEntry => ({
        groupKey: a.groupKey!,
        name: a.name || 'Unknown',
        source: 'universe',
      })
    );

  const seen = new Set<string>();
  const allGroups: GroupEntry[] = [];
  for (const g of [...ownedGroups, ...universeGroups]) {
    if (!seen.has(g.groupKey)) {
      seen.add(g.groupKey);
      allGroups.push(g);
    }
  }

  const isCustom = selectedKey === '__custom';
  const resolvedGroupKey = isCustom
    ? customGroupKey
    : allGroups.find(g => g.groupKey === selectedKey)?.groupKey;
  const canGenerate = !!resolvedGroupKey;

  const [newAddress, { loading }] = useNewTapAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const addr = data.newTapAddress?.encoded;
      if (addr) {
        setGeneratedAddr(addr);
        toast.success('Address generated');
      }
    },
  });

  const handleGenerate = () => {
    if (!resolvedGroupKey || !amount) {
      toast.error('Group key and amount are required');
      return;
    }
    setGeneratedAddr(null);
    newAddress({
      variables: {
        groupKey: resolvedGroupKey,
        amt: parseInt(amount, 10),
      },
    });
  };

  const handleCopy = () => {
    if (generatedAddr) {
      navigator.clipboard.writeText(generatedAddr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Receive Asset</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Group Key
            </label>
            <select
              value={selectedKey}
              onChange={e => {
                setSelectedKey(e.target.value);
                setGeneratedAddr(null);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a group...</option>
              {allGroups.map(g => (
                <option key={g.groupKey} value={g.groupKey}>
                  {g.name} ({g.groupKey.slice(0, 16)}...)
                  {g.source === 'universe' ? ' [universe]' : ''}
                </option>
              ))}
              <option value="__custom">Enter group key manually...</option>
            </select>
            {isCustom && (
              <input
                type="text"
                value={customGroupKey}
                onChange={e => setCustomGroupKey(e.target.value)}
                placeholder="Group key (hex)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono mt-2"
              />
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
              placeholder="100"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !canGenerate || !amount}
            size="sm"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Address
          </Button>
          {generatedAddr && (
            <div className="mt-2 p-3 rounded-md bg-muted">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-mono break-all">{generatedAddr}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
