import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFundTapAssetChannelMutation } from '../../graphql/mutations/__generated__/fundTapAssetChannel.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { Price } from '../../components/price/Price';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import { useConfigState } from '../../context/ConfigContext';
import { getErrorContent } from '../../utils/error';
import { formatAssetAmount } from '../../utils/helpers';
import { displayToAtomic } from './trade.helpers';

export const FundAssetChannel: FC = () => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } =
    useBitcoinFees(!fetchFees);

  const [peerPubkey, setPeerPubkey] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [assetAmount, setAssetAmount] = useState('');
  const [fee, setFee] = useState(0);
  const [feeType, setFeeType] = useState(fetchFees ? 'none' : 'fee');
  const [pushSat, setPushSat] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (feeType === 'none' && fee === 0) {
      setFee(fast);
    }
  }, [feeType, fee, fast]);

  const feeSpeedValue =
    fee === fast
      ? 'fast'
      : fee === halfHour
        ? 'half'
        : fee === hour
          ? 'hour'
          : '';

  const dedupedFees = (() => {
    const seen = new Set<number>();
    const options: { value: string; label: string }[] = [];
    const entries = [
      { value: 'fast', rate: fast, label: 'Fastest' },
      { value: 'half', rate: halfHour, label: '30 min' },
      { value: 'hour', rate: hour, label: '1 hour' },
    ];
    for (const e of entries) {
      if (!seen.has(e.rate)) {
        seen.add(e.rate);
        options.push({ value: e.value, label: `${e.label} (${e.rate})` });
      }
    }
    return options;
  })();

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const knownGroups = (
    balancesData?.taproot_assets?.get_balances?.balances || []
  )
    .filter(b => b.group_key && b.balance && Number(b.balance) > 0)
    .map(b => ({
      groupKey: b.group_key!,
      name: b.names?.[0] || 'Unknown',
      balance: b.balance!,
      precision: b.precision,
    }));

  const selectedGroup$ = knownGroups.find(g => g.groupKey === selectedGroup);
  const selectedBalance = selectedGroup$?.balance;
  const selectedPrecision = selectedGroup$?.precision ?? 0;

  const [fundChannel, { loading }] = useFundTapAssetChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const txid = data.taproot_assets?.fund_asset_channel?.txid;
      toast.success(`Asset channel funded! TX: ${txid?.slice(0, 16)}...`);
      setPeerPubkey('');
      setAssetAmount('');
      setFee(0);
      setFeeType(fetchFees ? 'none' : 'fee');
      setPushSat('');
      setConfirming(false);
    },
    refetchQueries: ['GetTapBalances'],
  });

  const handleFund = () => {
    if (!peerPubkey || !selectedGroup || !assetAmount) {
      toast.error('Peer pubkey, asset group, and amount are required');
      return;
    }
    const atomicAmount = displayToAtomic(
      assetAmount,
      selectedPrecision
    ).toString();
    fundChannel({
      variables: {
        input: {
          peer_pubkey: peerPubkey,
          asset_amount: atomicAmount,
          group_key: selectedGroup,
          fee_rate_sat_per_vbyte: fee > 0 ? fee : undefined,
          push_sat: pushSat ? parseInt(pushSat, 10) : undefined,
        },
      },
    });
  };

  const canOpen = !!peerPubkey && !!selectedGroup && !!assetAmount && fee > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Peer */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Peer Public Key
        </label>
        <Input
          value={peerPubkey}
          onChange={e => setPeerPubkey(e.target.value)}
          placeholder="PublicKey@Socket"
          className="font-mono"
        />
      </div>

      <Separator />

      {/* Asset */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Asset Group
        </label>
        <NativeSelect
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          className="w-full"
        >
          <NativeSelectOption value="">Select a group...</NativeSelectOption>
          {knownGroups.map(g => (
            <NativeSelectOption key={g.groupKey} value={g.groupKey}>
              {g.name} (balance:{' '}
              {formatAssetAmount(Number(g.balance), g.precision)})
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Asset Amount{' '}
            {selectedBalance && (
              <span className="text-foreground">
                (max:{' '}
                {formatAssetAmount(Number(selectedBalance), selectedPrecision)})
              </span>
            )}
          </label>
          {assetAmount && (
            <span className="text-[11px] text-muted-foreground">
              {displayToAtomic(assetAmount, selectedPrecision).toLocaleString()}{' '}
              atomic units
            </span>
          )}
        </div>
        <Input
          type="number"
          value={assetAmount}
          onChange={e => setAssetAmount(e.target.value)}
          placeholder="Amount of assets to commit"
        />
      </div>

      <Separator />

      {/* On-chain Fee */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            On-chain Fee{' '}
            <span className="text-foreground">
              <Price amount={fee * 223} />
            </span>
            {fetchFees && !dontShow && (
              <Badge variant="secondary" className="ml-1.5">
                min {minimum} sat/vB
              </Badge>
            )}
          </span>
          {fetchFees && !dontShow && (
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={feeType}
              onValueChange={value => {
                if (!value) return;
                if (value === 'none') {
                  setFeeType('none');
                  setFee(fast);
                } else {
                  setFee(0);
                  setFeeType('fee');
                }
              }}
            >
              <ToggleGroupItem value="none">Auto</ToggleGroupItem>
              <ToggleGroupItem value="fee">Custom</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>

        {feeType === 'none' ? (
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            className="w-full"
            value={feeSpeedValue}
            onValueChange={value => {
              if (!value) return;
              if (value === 'fast') setFee(fast);
              else if (value === 'half') setFee(halfHour);
              else if (value === 'hour') setFee(hour);
            }}
          >
            {dedupedFees.map(f => (
              <ToggleGroupItem key={f.value} value={f.value} className="flex-1">
                {f.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <Input
            placeholder="sats/vByte"
            type="number"
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="self-start -ml-2 text-muted-foreground"
        onClick={() => {
          setShowAdvanced(s => {
            if (s) setPushSat('');
            return !s;
          });
        }}
      >
        <ChevronDown
          size={14}
          className={showAdvanced ? 'rotate-180 transition' : 'transition'}
        />
        Advanced
      </Button>

      {showAdvanced && (
        <div className="flex flex-col gap-2 rounded border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-destructive">
              Push Sats to Peer
            </span>
            <span className="text-xs text-muted-foreground">
              These sats are gifted and cannot be recovered.
            </span>
          </div>
          <Input
            type="number"
            value={pushSat}
            onChange={e => setPushSat(e.target.value)}
            placeholder="Sats to push to peer"
          />
          {pushSat && Number(pushSat) > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertTriangle size={14} className="shrink-0" />
              <span>You will lose {pushSat} sats when this channel opens.</span>
            </div>
          )}
        </div>
      )}

      {confirming ? (
        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            disabled={loading}
            onClick={handleFund}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Confirm Open'
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="mt-1 w-full"
          disabled={!canOpen || loading}
          onClick={() => setConfirming(true)}
        >
          Open Channel <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};
