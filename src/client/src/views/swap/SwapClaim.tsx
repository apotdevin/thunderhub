import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { renderLine } from '../../components/generic/helpers';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Price } from '../../components/price/Price';
import { useConfigState } from '../../context/ConfigContext';
import { useClaimBoltzTransactionMutation } from '../../graphql/mutations/__generated__/claimBoltzTransaction.generated';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import { getErrorContent } from '../../utils/error';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { MEMPOOL } from './SwapStatus';

export const SwapClaim = () => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  const [fee, setFee] = useState<number>(0);
  const [type, setType] = useState('none');

  useEffect(() => {
    if (fast && type === 'none' && fee === 0) {
      setFee(fast);
    }
  }, [fast, type, fee]);

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

  const { swaps, claim, claimType } = useSwapsState();
  const dispatch = useSwapsDispatch();

  const [claimTransaction, { data, loading }] =
    useClaimBoltzTransactionMutation({
      onError: error => toast.error(getErrorContent(error)),
    });

  useEffect(() => {
    if (!data?.claimBoltzTransaction || typeof claim !== 'number') return;
    dispatch({
      type: 'complete',
      index: claim,
      transactionId: data.claimBoltzTransaction,
    });
    toast.success('Transaction Claimed');
  }, [data, dispatch, claim]);

  const Missing = () => (
    <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
      <AlertTriangle className="mr-2" size={14} />
      Missing information to claim transaction. Please try again.
    </div>
  );

  if (typeof claim !== 'number') {
    return <Missing />;
  }

  const claimingSwap = swaps[claim];
  const {
    redeemScript,
    preimage,
    receivingAddress,
    privateKey,
    id,
    lockupAddress,
  } = claimingSwap;

  if (!preimage || !lockupAddress || !privateKey) {
    return <Missing />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">
          Claim Transaction
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">{id}</p>
      </div>

      {claimType === MEMPOOL && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-600 dark:text-amber-400 text-center">
          <AlertTriangle size={12} className="inline mr-1.5 -mt-0.5" />
          Instant swap - the locking transaction from Boltz has not yet been
          confirmed in the blockchain.
        </div>
      )}

      {/* Fee selection */}
      {fetchFees && !dontShow && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Fee Mode
          </label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={type}
            onValueChange={value => {
              if (!value) return;
              if (value === 'none') {
                setType('none');
                setFee(fast);
              } else {
                setFee(0);
                setType('fee');
              }
            }}
          >
            <ToggleGroupItem value="none">Auto</ToggleGroupItem>
            <ToggleGroupItem value="fee">Custom</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {/* Fee amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Fee Amount
          </label>
          <span className="text-sm font-medium tabular-nums">
            <Price amount={fee * 111} />
          </span>
        </div>

        {type !== 'none' && (
          <Input
            placeholder={'Sats/Byte'}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}

        {type === 'none' && (
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
        )}
      </div>

      {!dontShow && renderLine('Minimum', `${minimum} sat/vByte`)}

      <p className="text-xs text-center text-amber-600 dark:text-amber-400">
        Low fees may cause delays if the mempool is congested. Select
        &quot;Auto&quot; above for fee estimates.
      </p>

      <Button
        disabled={loading || !fee || fee <= 0}
        className="w-full"
        onClick={() =>
          claimTransaction({
            variables: {
              id,
              redeem: redeemScript,
              lockupAddress,
              preimage,
              privateKey,
              destination: receivingAddress,
              fee,
            },
          })
        }
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          'Claim Transaction'
        )}
      </Button>
    </div>
  );
};
