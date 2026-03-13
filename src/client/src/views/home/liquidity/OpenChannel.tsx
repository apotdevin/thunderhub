import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Loader2,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useOpenChannelMutation } from '../../../graphql/mutations/__generated__/openChannel.generated';
import { Input } from '@/components/ui/input';
import { Price } from '../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useBitcoinFees } from '../../../hooks/UseBitcoinFees';
import { useConfigState } from '../../../context/ConfigContext';
import { PeerSelect } from '../../../components/select/specific/PeerSelect';
import { Separator } from '@/components/ui/separator';
import { getErrorContent } from '../../../utils/error';

type OpenChannelProps = {
  closeCbk: () => void;
};

export const OpenChannel = ({ closeCbk }: OpenChannelProps) => {
  const [useRecommended, setUseRecommended] = useState(true);

  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } =
    useBitcoinFees(!fetchFees);
  const [size, setSize] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [pushType, setPushType] = useState('none');
  const [pushTokens, setPushTokens] = useState(0);

  const [isNewPeer, setIsNewPeer] = useState<boolean>(true);
  const [fee, setFee] = useState(0);
  const [publicKey, setPublicKey] = useState('');
  const [privateChannel, setPrivateChannel] = useState(false);
  const [isMaxFunding, setIsMaxFunding] = useState(false);
  const [type, setType] = useState(fetchFees ? 'none' : 'fee');

  const [feeRate, setFeeRate] = useState<number | null>(null);
  const [baseFee, setBaseFee] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [openChannel, { loading }] = useOpenChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Channel Opened');
      closeCbk();
    },
    refetchQueries: ['GetChannels', 'GetPendingChannels'],
  });

  const canOpen =
    (publicKey !== '' || useRecommended) &&
    (size > 0 || isMaxFunding) &&
    fee > 0;

  const pushAmount =
    pushType === 'none'
      ? 0
      : pushType === 'half'
        ? size / 2
        : Math.min(pushTokens, size * 0.9);

  useEffect(() => {
    if (type === 'none' && fee === 0) {
      setFee(fast);
    }
  }, [type, fee, fast]);

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

  return (
    <div className="flex flex-col gap-3">
      {/* Peer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Use Recommended Peer
        </span>
        <Switch checked={useRecommended} onCheckedChange={setUseRecommended} />
      </div>

      {useRecommended ? (
        <div className="flex items-start gap-3 rounded border border-primary/20 bg-primary/5 p-3">
          <Zap size={16} className="mt-0.5 shrink-0 text-primary" />
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="font-medium text-primary">
              Amboss Rails Cluster
            </span>
            <span className="text-muted-foreground">
              Optimized for fast, reliable, high-throughput payments.{' '}
              <a
                className="text-primary hover:underline"
                href="https://amboss.tech/rails/stats"
                target="_blank"
              >
                Learn more
              </a>
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 rounded border border-orange-500/30 bg-orange-500/5 p-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-orange-500"
            />
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="font-medium text-orange-500">
                Performance may vary
              </span>
              <span className="text-muted-foreground">
                For the best experience, connect to the{' '}
                <button
                  className="inline cursor-pointer border-none bg-transparent p-0 text-xs text-primary hover:underline"
                  onClick={() => setUseRecommended(true)}
                >
                  Amboss Rails cluster
                </button>
                .
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Node
              </label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={isNewPeer ? 'new' : 'existing'}
                onValueChange={value => {
                  if (value) {
                    setIsNewPeer(value === 'new');
                    setPublicKey('');
                  }
                }}
              >
                <ToggleGroupItem value="new">New</ToggleGroupItem>
                <ToggleGroupItem value="existing">Existing</ToggleGroupItem>
              </ToggleGroup>
            </div>
            {isNewPeer ? (
              <Input
                value={publicKey}
                placeholder="PublicKey@Socket"
                onChange={e => setPublicKey(e.target.value)}
              />
            ) : (
              <PeerSelect callback={peer => setPublicKey(peer[0].public_key)} />
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Channel Size */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Max Size
        </span>
        <Switch
          checked={isMaxFunding}
          onCheckedChange={v => {
            setIsMaxFunding(v);
            if (v) setSize(0);
          }}
        />
      </div>

      {!isMaxFunding && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Channel Size{' '}
            <span className="text-foreground">
              <Price amount={size} />
            </span>
          </label>
          <Input
            placeholder="Sats"
            type="number"
            value={size && size > 0 ? size : ''}
            onChange={e => setSize(Number(e.target.value))}
          />
        </div>
      )}

      <Separator />

      {/* Channel Fees */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Fee Rate{' '}
            {feeRate != null && (
              <span className="text-foreground">
                <Price amount={feeRate} override="ppm" />
              </span>
            )}
          </label>
          <Input
            placeholder="ppm"
            type="number"
            value={feeRate != null && feeRate > 0 ? feeRate : ''}
            onChange={e => {
              if (e.target.value === '') {
                setFeeRate(null);
              } else {
                setFeeRate(Number(e.target.value));
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Base Fee{' '}
            {baseFee != null && (
              <span className="text-foreground">
                <Price amount={baseFee} />
              </span>
            )}
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={baseFee != null && baseFee > 0 ? baseFee : ''}
            onChange={e => {
              if (e.target.value === '') {
                setBaseFee(null);
              } else {
                setBaseFee(Number(e.target.value));
              }
            }}
          />
        </div>
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
          )}
        </div>

        {type === 'none' ? (
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

      <Separator />

      {/* Advanced */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Advanced
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowAdvanced(s => {
              if (s) {
                setPrivateChannel(false);
                setPushType('none');
                setPushTokens(0);
              }
              return !s;
            });
          }}
        >
          {showAdvanced ? <X size={14} /> : <Settings size={14} />}
        </Button>
      </div>

      {showAdvanced && (
        <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Type
            </span>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={privateChannel ? 'private' : 'public'}
              onValueChange={value => {
                if (value) setPrivateChannel(value === 'private');
              }}
            >
              <ToggleGroupItem value="private">Private</ToggleGroupItem>
              <ToggleGroupItem value="public">Public</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 rounded border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-destructive">
                  Push Tokens to Peer
                </span>
                <span className="text-xs text-muted-foreground">
                  These sats are gifted and cannot be recovered.
                </span>
              </div>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={pushType}
                onValueChange={value => {
                  if (value) setPushType(value);
                }}
              >
                <ToggleGroupItem value="none">None</ToggleGroupItem>
                <ToggleGroupItem
                  value="half"
                  className="data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive"
                >
                  Half
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="custom"
                  className="data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive"
                >
                  Custom
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {pushType === 'custom' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Amount{' '}
                  <span className="text-destructive">
                    <Price amount={Math.min(pushTokens, size * 0.9)} />
                  </span>
                </label>
                <Input
                  placeholder={
                    size > 0 ? `Sats (Max: ${Math.floor(size * 0.9)})` : 'Sats'
                  }
                  type="number"
                  value={pushTokens > 0 ? pushTokens : ''}
                  onChange={e => setPushTokens(Number(e.target.value))}
                />
              </div>
            )}

            {pushType !== 'none' && pushAmount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                <AlertTriangle size={14} className="shrink-0" />
                <span>
                  You will lose <Price amount={pushAmount} /> when this channel
                  opens.
                </span>
              </div>
            )}
          </div>
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
            onClick={() =>
              openChannel({
                variables: {
                  input: {
                    channel_size: size,
                    is_recommended: useRecommended,
                    partner_public_key: publicKey || '',
                    is_private: privateChannel,
                    is_max_funding: isMaxFunding,
                    give_tokens: pushAmount,
                    chain_fee_tokens_per_vbyte: fee,
                    base_fee_mtokens:
                      baseFee == null ? undefined : baseFee * 1000 + '',
                    fee_rate: feeRate,
                  },
                },
              })
            }
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
