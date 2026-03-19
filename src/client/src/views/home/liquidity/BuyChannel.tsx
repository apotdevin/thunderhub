import { useGetLiquidityPerUsdQuery } from '../../../graphql/queries/__generated__/getLiquidityPerUsd.generated';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber } from '../../../utils/helpers';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  DollarSign,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { usePurchaseLiquidityMutation } from '../../../graphql/mutations/__generated__/purchaseLiquidity.generated';
import toast from 'react-hot-toast';
import { useGetAmbossLoginTokenLazyQuery } from '../../../graphql/queries/__generated__/getAmbossLoginToken.generated';
import { Badge } from '@/components/ui/badge';

const GoToMagmaLink = () => {
  const [getToken, { data, loading: tokenLoading }] =
    useGetAmbossLoginTokenLazyQuery({
      fetchPolicy: 'network-only',
      onError: () => toast.error('Error getting auth token'),
    });

  useEffect(() => {
    if (!data?.getAmbossLoginToken || tokenLoading) {
      return;
    }
    if (!window?.open) return;

    const url = data.getAmbossLoginToken;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  return (
    <button
      className="inline-flex cursor-pointer items-center gap-0.5 border-none bg-transparent p-0 text-[10px] text-primary hover:underline disabled:opacity-50"
      disabled={tokenLoading}
      onClick={() => {
        getToken({
          variables: { redirect_url: 'https://magma.amboss.tech/oauth' },
        });
      }}
    >
      {tokenLoading ? (
        <Loader2 className="inline animate-spin" size={10} />
      ) : (
        <>
          Magma Marketplace
          <ExternalLink size={8} />
        </>
      )}
    </button>
  );
};

const PRESET_AMOUNTS = [10, 25, 50, 100];
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 5_000;

export const BuyChannel = () => {
  const [amount, setAmount] = useState<number>(10);
  const [custom, setCustom] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { data, loading, error } = useGetLiquidityPerUsdQuery();

  const [purchase, purchaseData] = usePurchaseLiquidityMutation({
    onCompleted: () => {
      toast.success('Liquidity Purchased!');
      setConfirming(false);
    },
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
      setConfirming(false);
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (!data?.getLiquidityPerUsd || error) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="text-sm text-muted-foreground">
          Unable to fetch liquidity pricing. Please try again.
        </span>
      </div>
    );
  }

  const satsPerUsd = Number(data.getLiquidityPerUsd);
  const totalSats = satsPerUsd * amount;
  const formattedAmount = formatCurrency(amount, 'USD');
  const formattedLiquidity = formatNumber(totalSats);

  const isLoading = loading || purchaseData.loading;

  return (
    <div className="flex flex-col gap-4">
      {/* Value proposition */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Zap, label: 'Instant Setup', color: 'text-yellow-500' },
          {
            icon: ShieldCheck,
            label: 'Trusted Peers',
            color: 'text-green-500',
          },
          {
            icon: ArrowRight,
            label: 'Start Receiving',
            color: 'text-blue-500',
          },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded border border-border p-2.5"
          >
            <Icon size={16} className={color} />
            <span className="text-[10px] font-medium text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Amount selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Select Amount
        </label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map(preset => (
            <button
              key={preset}
              onClick={() => {
                setAmount(preset);
                setCustom(false);
              }}
              className={`flex cursor-pointer items-center justify-center rounded border p-2.5 text-sm font-semibold transition-colors ${
                !custom && amount === preset
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              ${preset}
            </button>
          ))}
          <button
            onClick={() => {
              setCustom(true);
              setAmount(0);
            }}
            className={`flex cursor-pointer items-center justify-center rounded border p-2.5 text-sm font-semibold transition-colors ${
              custom
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom amount input */}
      {custom && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Amount{' '}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              ${MIN_AMOUNT} – ${MAX_AMOUNT.toLocaleString()}
            </Badge>
          </label>
          <div className="relative">
            <DollarSign
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-8"
              placeholder="USD"
              type="number"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              value={amount && amount > 0 ? amount : ''}
              onChange={e => {
                const val = Number(e.target.value);
                setAmount(Math.min(Math.max(val, 0), MAX_AMOUNT));
              }}
            />
          </div>
        </div>
      )}

      {/* Summary card */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              You pay
            </span>
            <span className="text-xl font-bold text-foreground">
              {formattedAmount}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <ArrowRight size={16} className="text-primary" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              You receive
            </span>
            <span className="text-xl font-bold text-primary">
              ~{formattedLiquidity}
            </span>
            <span className="text-[10px] text-muted-foreground">
              sats inbound
            </span>
          </div>
        </div>
      </div>

      {/* Purchase / Confirm */}
      {!confirming ? (
        <Button
          className="w-full"
          disabled={
            !amount || amount < MIN_AMOUNT || amount > MAX_AMOUNT || isLoading
          }
          onClick={() => setConfirming(true)}
        >
          Boost Your Liquidity for {formattedAmount}
        </Button>
      ) : (
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
            disabled={isLoading}
            onClick={() =>
              purchase({
                variables: { amount_cents: (amount * 100).toString() },
              })
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              `Confirm ${formattedAmount}`
            )}
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          Sourced from{' '}
          <a
            className="text-primary hover:underline"
            href="https://amboss.tech/rails/stats"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amboss Rails
          </a>
          {' · '}
          <GoToMagmaLink />
        </span>
        <span>Amounts are estimates</span>
      </div>
    </div>
  );
};
