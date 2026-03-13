import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCloseChannelMutation } from '@/graphql/mutations/__generated__/closeChannel.generated';
import { useBitcoinFees } from '@/hooks/UseBitcoinFees';
import { useConfigState } from '@/context/ConfigContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getErrorContent } from '../../../utils/error';

type CloseChannelProps = {
  channelId: string;
  channelName: string;
  callback?: () => void;
};

export const CloseChannel = ({ channelId, callback }: CloseChannelProps) => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  const [isForce, setIsForce] = useState(false);
  const [feeType, setFeeType] = useState<'auto' | 'fee' | 'target'>('fee');
  const [amount, setAmount] = useState<number | undefined>();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [closeChannel, { loading }] = useCloseChannelMutation({
    onCompleted: () => {
      toast.success('Channel Closed');
      setIsConfirmed(false);
      callback?.();
    },
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: [
      'GetChannels',
      'GetPendingChannels',
      'GetClosedChannels',
      'GetChannelAmountInfo',
    ],
  });

  const handleClose = () => {
    let details:
      | { target: number }
      | { tokens: number }
      | Record<string, unknown> =
      feeType === 'target' ? { target: amount } : { tokens: amount };

    if (isForce) {
      details = {};
    }

    closeChannel({
      variables: {
        id: channelId,
        forceClose: isForce,
        ...details,
      },
    });
  };

  const feeSpeedValue =
    amount === fast
      ? 'fast'
      : amount === halfHour
        ? 'half'
        : amount === hour
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

  return (
    <div className="flex flex-col gap-3">
      {/* Force close toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            Force Close
          </span>
          {isForce && (
            <span className="text-xs text-destructive">
              Force closing can take days and may result in higher fees.
            </span>
          )}
        </div>
        <Switch
          checked={isForce}
          onCheckedChange={v => {
            if (v) setAmount(undefined);
            setIsForce(v);
          }}
        />
      </div>

      {!isForce && (
        <>
          <Separator />

          {/* Fee type */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Fee{' '}
                {fetchFees && !dontShow && (
                  <Badge variant="secondary" className="ml-1.5">
                    min {minimum} sat/vB
                  </Badge>
                )}
              </span>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={feeType}
                onValueChange={value => {
                  if (!value) return;
                  setAmount(undefined);
                  setFeeType(value as 'auto' | 'fee' | 'target');
                }}
              >
                {fetchFees && !dontShow && (
                  <ToggleGroupItem value="auto">Auto</ToggleGroupItem>
                )}
                <ToggleGroupItem value="fee">Fee</ToggleGroupItem>
                <ToggleGroupItem value="target">Target</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {feeType === 'auto' ? (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                className="w-full"
                value={feeSpeedValue}
                onValueChange={value => {
                  if (!value) return;
                  if (value === 'fast') setAmount(fast);
                  else if (value === 'half') setAmount(halfHour);
                  else if (value === 'hour') setAmount(hour);
                }}
              >
                {dedupedFees.map(f => (
                  <ToggleGroupItem
                    key={f.value}
                    value={f.value}
                    className="flex-1"
                  >
                    {f.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {feeType === 'target' ? 'Target Blocks' : 'Fee (sats/vByte)'}
                </label>
                <Input
                  placeholder={feeType === 'target' ? 'Blocks' : 'sats/vByte'}
                  type="number"
                  value={amount != null && amount > 0 ? amount : ''}
                  onChange={e => setAmount(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </>
      )}

      {isConfirmed ? (
        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => setIsConfirmed(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={loading}
            onClick={handleClose}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Confirm Close'
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          disabled={!amount && !isForce}
          className="mt-1 w-full"
          onClick={() => setIsConfirmed(true)}
        >
          Close Channel <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};
