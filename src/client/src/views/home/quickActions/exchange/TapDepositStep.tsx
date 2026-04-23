import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronDown, Copy, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
import { useNewTapAddressMutation } from '../../../../graphql/mutations/__generated__/newTapAddress.generated';
import { useGetTapBalancesQuery } from '../../../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapUniverseAssetsQuery } from '../../../../graphql/queries/__generated__/getTapUniverseAssets.generated';
import { useGetTapFederationServersQuery } from '../../../../graphql/queries/__generated__/getTapFederationServers.generated';
import { TapBalanceGroupBy } from '../../../../graphql/types';
import { getErrorContent } from '../../../../utils/error';
import { displayToAtomic } from '../../../assets/trade.helpers';

type GroupEntry = {
  groupKey: string;
  name: string;
  source: 'owned' | 'universe';
};

const toProofCourierAddr = (host: string): string =>
  `authmailbox+universerpc://${host}`;

export const TapDepositStep: FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedKey, setSelectedKey] = useState('');
  const [customGroupKey, setCustomGroupKey] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedAddr, setGeneratedAddr] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState('__default');
  const [customCourier, setCustomCourier] = useState('');

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const { data: universeData } = useGetTapUniverseAssetsQuery();

  const { data: fedData } = useGetTapFederationServersQuery({
    skip: !showAdvanced,
  });

  const federationServers =
    fedData?.taproot_assets?.get_federation_servers?.servers || [];

  const balances = balancesData?.taproot_assets?.get_balances?.balances || [];

  const precisionByGroupKey = new Map<string, number>();
  for (const b of balances) {
    if (b.group_key) precisionByGroupKey.set(b.group_key, b.precision);
  }

  const ownedGroups = balances
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

  const selectedPrecision = resolvedGroupKey
    ? (precisionByGroupKey.get(resolvedGroupKey) ?? 0)
    : 0;

  const handleGenerate = () => {
    if (!resolvedGroupKey || !amount) {
      toast.error('Group key and amount are required');
      return;
    }
    const atomicAmt = displayToAtomic(amount, selectedPrecision).toString();
    setGeneratedAddr(null);
    newAddress({
      variables: {
        group_key: resolvedGroupKey,
        amt: atomicAmt,
        proof_courier_addr: resolvedCourier,
      },
    });
  };

  if (generatedAddr) {
    return (
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="self-start -ml-2"
          onClick={() => setGeneratedAddr(null)}
        >
          <ChevronLeft size={14} />
          Back
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          Taproot Asset Address
        </span>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={generatedAddr} size={200} />
          </div>
          <div className="w-full break-all rounded border border-border px-3 py-2 text-center font-mono text-xs">
            {generatedAddr}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard
                .writeText(generatedAddr)
                .then(() => toast.success('Address Copied'))
            }
          >
            <Copy size={14} />
            Copy Address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start -ml-2"
          onClick={onBack}
        >
          <ChevronLeft size={14} />
          Back
        </Button>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Asset Group
        </label>
        <Select
          value={selectedKey}
          onValueChange={v => {
            setSelectedKey(v);
            setGeneratedAddr(null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an asset..." />
          </SelectTrigger>
          <SelectContent>
            {allGroups.length > 0 && (
              <SelectGroup>
                <SelectLabel>Available Assets</SelectLabel>
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
            className="font-mono mt-1"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Amount
          </label>
          {amount && (
            <span className="text-[11px] text-muted-foreground">
              {displayToAtomic(amount, selectedPrecision).toLocaleString()}{' '}
              atomic units
            </span>
          )}
        </div>
        <Input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="100"
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="self-start -ml-2 text-muted-foreground"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <ChevronDown
          size={14}
          className={showAdvanced ? 'rotate-180 transition' : 'transition'}
        />
        Advanced
      </Button>
      {showAdvanced && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
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
              <SelectItem value="__custom">Enter custom address...</SelectItem>
            </SelectContent>
          </Select>
          {isCustomCourier && (
            <Input
              value={customCourier}
              onChange={e => setCustomCourier(e.target.value)}
              placeholder="authmailbox+universerpc://host:port"
              className="font-mono mt-1"
            />
          )}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading || !resolvedGroupKey || !amount}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          'Generate Address'
        )}
      </Button>
    </div>
  );
};
