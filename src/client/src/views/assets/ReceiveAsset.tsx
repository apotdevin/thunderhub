import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNewTapAddressMutation } from '../../graphql/mutations/__generated__/newTapAddress.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapUniverseAssetsQuery } from '../../graphql/queries/__generated__/getTapUniverseAssets.generated';
import { useGetTapFederationServersQuery } from '../../graphql/queries/__generated__/getTapFederationServers.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

type GroupEntry = {
  groupKey: string;
  name: string;
  source: 'owned' | 'universe';
};

const toProofCourierAddr = (host: string): string =>
  `authmailbox+universerpc://${host}`;

export const ReceiveAsset: FC = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [customGroupKey, setCustomGroupKey] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('__default');
  const [customCourier, setCustomCourier] = useState('');
  const [generatedAddr, setGeneratedAddr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const { data: universeData } = useGetTapUniverseAssetsQuery();

  const { data: fedData } = useGetTapFederationServersQuery();

  const federationServers =
    fedData?.taproot_assets?.get_federation_servers?.servers || [];

  // Merge owned assets and universe assets, deduplicate by group key
  const ownedGroups = (
    balancesData?.taproot_assets?.get_balances?.balances || []
  )
    .filter(b => b.group_key)
    .map(
      (b): GroupEntry => ({
        groupKey: b.group_key!,
        name: b.names?.join(', ') || 'Unknown',
        source: 'owned',
      })
    );

  const universeGroups = (
    universeData?.taproot_assets?.get_universe_assets?.assets || []
  )
    .filter(a => a.group_key)
    .map(
      (a): GroupEntry => ({
        groupKey: a.group_key!,
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

  const isCustomGroup = selectedKey === '__custom';
  const resolvedGroupKey = isCustomGroup
    ? customGroupKey
    : allGroups.find(g => g.groupKey === selectedKey)?.groupKey;
  const canGenerate = !!resolvedGroupKey;

  const isCustomCourier = selectedCourier === '__custom';
  const resolvedCourier =
    selectedCourier === '__default'
      ? undefined
      : isCustomCourier
        ? customCourier || undefined
        : selectedCourier;

  const [newAddress, { loading }] = useNewTapAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const addr = data.taproot_assets?.new_address?.encoded;
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
        group_key: resolvedGroupKey,
        amt: amount,
        proof_courier_addr: resolvedCourier,
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
            <Select
              value={selectedKey}
              onValueChange={v => {
                setSelectedKey(v);
                setGeneratedAddr(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a group..." />
              </SelectTrigger>
              <SelectContent>
                {allGroups.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Available Groups</SelectLabel>
                    {allGroups.map(g => (
                      <SelectItem key={g.groupKey} value={g.groupKey}>
                        {g.name} ({g.groupKey.slice(0, 16)}...)
                        {g.source === 'universe' ? ' [universe]' : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                <SelectSeparator />
                <SelectItem value="__custom">
                  Enter group key manually...
                </SelectItem>
              </SelectContent>
            </Select>
            {isCustomGroup && (
              <Input
                value={customGroupKey}
                onChange={e => setCustomGroupKey(e.target.value)}
                placeholder="Group key (hex)"
                className="font-mono mt-2"
              />
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Proof Courier
            </label>
            <Select
              value={selectedCourier}
              onValueChange={v => {
                setSelectedCourier(v);
                setGeneratedAddr(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__default">Default</SelectItem>
                {federationServers.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Synced Universes</SelectLabel>
                    {federationServers.map(s => {
                      const uri = toProofCourierAddr(s.host);
                      return (
                        <SelectItem key={s.host} value={uri}>
                          {uri}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                )}
                <SelectSeparator />
                <SelectItem value="__custom">
                  Enter custom address...
                </SelectItem>
              </SelectContent>
            </Select>
            {isCustomCourier && (
              <Input
                value={customCourier}
                onChange={e => setCustomCourier(e.target.value)}
                placeholder="authmailbox+universerpc://host:port"
                className="font-mono mt-2"
              />
            )}
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
