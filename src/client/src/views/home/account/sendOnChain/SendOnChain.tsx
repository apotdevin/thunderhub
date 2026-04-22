import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePayAddressMutation } from '../../../../graphql/mutations/__generated__/sendToAddress.generated';
import { Input } from '@/components/ui/input';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import { getErrorContent } from '../../../../utils/error';
import { Price, getPrice } from '../../../../components/price/Price';
import { useConfigState } from '../../../../context/ConfigContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { usePriceState } from '../../../../context/PriceContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const SendOnChainCard = ({ setOpen }: { setOpen: () => void }) => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();
  const { currency, displayValues, fetchFees } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const [confirming, setConfirming] = useState(false);

  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [type, setType] = useState(dontShow || !fetchFees ? 'fee' : 'none');
  const [amount, setAmount] = useState(0);
  const [sendAll, setSendAll] = useState(false);
  const [customFee, setCustomFee] = useState(false);

  const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

  const [payAddress, { loading }] = usePayAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent!');
      setOpen();
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  useEffect(() => {
    if (type === 'none' && amount === 0) {
      setAmount(fast);
    }
  }, [type, amount, fast]);

  const feeEstimate = () => {
    if (type === 'target') {
      return <>(~{amount} blocks)</>;
    }
    return <>(~{format({ amount: amount * 223 })})</>;
  };

  const typeAmount = () => {
    switch (type) {
      case 'none':
      case 'fee':
        return { fee: amount };
      case 'target':
        return { target: amount };
      default:
        return {};
    }
  };

  const tokenAmount = sendAll ? { sendAll } : { tokens };

  // Deduplicate fee speeds
  const feeSpeeds = [
    { label: 'Fastest', value: fast },
    ...(halfHour !== fast ? [{ label: '30 min', value: halfHour }] : []),
    ...(hour !== halfHour ? [{ label: '1 hour', value: hour }] : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Address */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Address
        </label>
        <Input
          value={address}
          placeholder="bc1..."
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <Separator />

      {/* Send All toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Send All
        </span>
        <Switch checked={sendAll} onCheckedChange={setSendAll} />
      </div>

      {/* Amount */}
      {!sendAll && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Amount{' '}
            <span className="text-foreground">
              <Price amount={tokens} />
            </span>
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={tokens && tokens > 0 ? tokens : ''}
            onChange={e => setTokens(Number(e.target.value))}
          />
        </div>
      )}

      <Separator />

      {/* Fee type */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Fee Type
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={type}
          onValueChange={v => {
            if (!v) return;
            setType(v);
            setCustomFee(false);
            if (v === 'none') setAmount(fast);
            else setAmount(0);
          }}
        >
          {fetchFees && !dontShow && (
            <ToggleGroupItem value="none">Auto</ToggleGroupItem>
          )}
          <ToggleGroupItem value="fee">Fee</ToggleGroupItem>
          <ToggleGroupItem value="target">Target</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Fee amount */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Fee Amount{' '}
            <span className="text-foreground/60">{feeEstimate()}</span>
            {!dontShow && (
              <Badge variant="secondary" className="ml-1.5 text-[10px]">
                min {minimum} sat/vB
              </Badge>
            )}
          </span>
        </div>

        {type === 'none' ? (
          <>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              className="w-full"
              value={customFee ? 'custom' : String(amount)}
              onValueChange={v => {
                if (!v) return;
                if (v === 'custom') {
                  setCustomFee(true);
                  setAmount(0);
                } else {
                  setCustomFee(false);
                  setAmount(Number(v));
                }
              }}
            >
              {feeSpeeds.map(s => (
                <ToggleGroupItem
                  key={s.value}
                  value={String(s.value)}
                  className="flex-1"
                >
                  {s.label} ({s.value})
                </ToggleGroupItem>
              ))}
              <ToggleGroupItem value="custom" className="flex-1">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
            {customFee && (
              <Input
                value={amount && amount > 0 ? amount : ''}
                placeholder="sats/vB"
                type="number"
                onChange={e => setAmount(Number(e.target.value))}
              />
            )}
          </>
        ) : (
          <Input
            value={amount && amount > 0 ? amount : ''}
            placeholder={type === 'target' ? 'Blocks' : 'sats/vB'}
            type="number"
            onChange={e => setAmount(Number(e.target.value))}
          />
        )}
      </div>

      {/* Send / Confirm */}
      {!confirming ? (
        <Button
          variant="outline"
          disabled={!canSend || loading}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Send
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="divide-y divide-border rounded border border-border text-xs">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {sendAll ? 'All' : <Price amount={tokens} />}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Address</span>
              <span className="max-w-50 truncate font-mono text-[11px] font-medium">
                {address}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">
                {type === 'target' ? `${amount} blocks` : `${amount} sats/vB`}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!canSend || loading}
              onClick={() =>
                payAddress({
                  variables: { address, ...typeAmount(), ...tokenAmount },
                })
              }
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                'Confirm Send'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
