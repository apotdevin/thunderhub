import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Loader2,
  Edit2,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Shuffle,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { useGetBoltzInfoQuery } from '../../graphql/queries/__generated__/getBoltzInfo.generated';
import { useCreateBoltzReverseSwapMutation } from '../../graphql/mutations/__generated__/createBoltzReverseSwap.generated';
import { usePayMutation } from '../../graphql/mutations/__generated__/pay.generated';
import { getErrorContent } from '../../utils/error';
import {
  useBoltzSwapActions,
  useBoltzSwapById,
} from '../../context/BoltzSwapContext';
import { boltzStatusLabel } from '../../views/swap/boltzStatus';
import {
  SwapProgressStepper,
  getSwapStep,
} from '../../views/swap/SwapProgress';
import { Price } from '../../components/price/Price';
import { Slider } from '../../components/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// --- State machine for auto-pay flow ---

type SwapStep = 'idle' | 'quote' | 'paying' | 'claiming' | 'done' | 'error';

const SwapWidget = ({ max, min }: { max: number; min: number }) => {
  const actions = useBoltzSwapActions();

  const [amount, setAmount] = useState<number>(min);
  const [isEdit, setIsEdit] = useState(false);
  const [quickPay, setQuickPay] = useState(true);
  const [step, setStep] = useState<SwapStep>('idle');
  const [errorMsg, setErrorMsg] = useState<string>();
  const [pendingSwapId, setPendingSwapId] = useState<string | null>(null);

  const pendingSwap = useBoltzSwapById(pendingSwapId);

  // Derive effective step from global swap state when we have a pending swap
  const derivedStep = pendingSwap ? getSwapStep(pendingSwap) : null;
  const effectiveStep: SwapStep =
    step === 'idle' || step === 'error' || !derivedStep ? step : derivedStep;

  // Watch for terminal states from global context
  const claimState = pendingSwap?.claimState;
  const boltzStatus = pendingSwap?.liveStatus?.status ?? null;

  useEffect(() => {
    if (pendingSwap && claimState === 'claimed' && step !== 'idle') {
      setStep('idle');
      setPendingSwapId(null);
    }
    if (
      pendingSwap &&
      claimState === 'failed' &&
      step !== 'idle' &&
      step !== 'error'
    ) {
      setStep('error');
      setErrorMsg('Auto-claim failed');
      setPendingSwapId(null);
    }
  }, [pendingSwap, claimState, step]);

  const resetFlow = useCallback(() => {
    setStep('idle');
    setErrorMsg(undefined);
    setPendingSwapId(null);
  }, []);

  const [pay] = usePayMutation({
    onError: error => {
      setStep('error');
      setErrorMsg('Payment failed');
      toast.error(getErrorContent(error));
      setPendingSwapId(null);
    },
  });

  const [getQuote] = useCreateBoltzReverseSwapMutation({
    onError: error => {
      setStep('error');
      setErrorMsg('Quote failed');
      toast.error(getErrorContent(error));
    },
    onCompleted: result => {
      const swap = result.createBoltzReverseSwap;
      actions.addSwap(swap);

      if (quickPay && swap.invoice) {
        setPendingSwapId(swap.id);
        setStep('paying');

        const maxFee = Math.min(
          10000,
          Math.max(100, Math.round(amount * 0.005))
        );
        pay({
          variables: {
            max_fee: maxFee,
            max_paths: 10,
            request: swap.invoice,
          },
        });
      } else {
        actions.openSwap(swap.id);
      }
    },
  });

  const handleSwap = () => {
    setStep('quote');
    setErrorMsg(undefined);
    getQuote({ variables: { amount } });
  };

  const isActive =
    effectiveStep !== 'idle' &&
    effectiveStep !== 'done' &&
    effectiveStep !== 'error';

  // Build status description from Boltz WS or fallback to step
  const statusText = (() => {
    if (effectiveStep === 'done') return 'Swap complete!';
    const live = boltzStatusLabel(boltzStatus);
    if (live) return live;
    if (effectiveStep === 'quote') return 'Creating swap...';
    if (effectiveStep === 'paying') return 'Paying invoice...';
    if (effectiveStep === 'claiming') return 'Claiming to on-chain...';
    return '';
  })();

  return (
    <div className="space-y-2.5">
      {effectiveStep === 'idle' || effectiveStep === 'error' ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              Amount
            </span>
            <span className="text-xs font-medium tabular-nums">
              <Price amount={amount} />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isEdit ? (
              <Input
                className="flex-1 h-7 text-xs"
                value={amount}
                type="number"
                placeholder="Satoshis"
                onChange={e => setAmount(Number(e.target.value))}
              />
            ) : (
              <div className="flex-1">
                <Slider
                  value={amount}
                  max={max}
                  min={min}
                  onChange={setAmount}
                />
              </div>
            )}
            <Button
              variant={isEdit ? 'default' : 'outline'}
              size="icon"
              className="shrink-0 h-7 w-7"
              onClick={() => setIsEdit(p => !p)}
            >
              {isEdit ? <X size={12} /> : <Edit2 size={12} />}
            </Button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={quickPay}
              onCheckedChange={v => setQuickPay(v === true)}
              className="h-3.5 w-3.5"
            />
            <span className="text-[11px] text-muted-foreground select-none">
              Auto pay invoice
            </span>
          </label>

          {effectiveStep === 'error' && errorMsg && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-500">
              <AlertTriangle size={11} />
              <span>{errorMsg}</span>
              <button
                className="ml-auto text-muted-foreground hover:text-foreground underline"
                onClick={resetFlow}
              >
                Dismiss
              </button>
            </div>
          )}

          <Button
            variant={'secondary'}
            disabled={!amount}
            onClick={handleSwap}
            className="w-full h-8 text-xs"
            size="sm"
          >
            <Zap size={12} className="mr-1" />
            {quickPay ? 'Swap & Pay' : 'Get Quote'}
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </>
      ) : (
        <>
          <SwapProgressStepper currentStep={effectiveStep} error={errorMsg} />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground">
              {statusText}
            </span>
            <span className="text-xs font-medium tabular-nums">
              <Price amount={amount} />
            </span>
          </div>

          {effectiveStep === 'done' && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500">
              <Check size={11} />
              <span>Funds sent to your Bitcoin address</span>
            </div>
          )}

          {isActive && (
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500/60 rounded-full animate-pulse w-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --- Outer wrapper ---

export const SidebarSwap = () => {
  const { sidebarSwapExpanded } = useConfigState();
  const dispatch = useConfigDispatch();

  const { data, loading, error } = useGetBoltzInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const toggleExpanded = () => {
    dispatch({ type: 'change', sidebarSwapExpanded: !sidebarSwapExpanded });
  };

  if (loading) {
    return (
      <div className="p-2 border-t border-border/60">
        <button
          onClick={toggleExpanded}
          className={cn(
            'flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors',
            sidebarSwapExpanded && 'mb-2'
          )}
        >
          {sidebarSwapExpanded ? (
            <ChevronDown size={10} />
          ) : (
            <ChevronUp size={10} />
          )}
          <Shuffle size={13} className="text-emerald-500" />
          Quick Swap
        </button>
        {sidebarSwapExpanded && (
          <div className="flex items-center justify-center py-4">
            <Loader2
              className="animate-spin text-muted-foreground/40"
              size={16}
            />
          </div>
        )}
      </div>
    );
  }

  if (error || !data?.getBoltzInfo) {
    return null;
  }

  const { max, min, feePercent } = data.getBoltzInfo;

  return (
    <div className="p-2 border-t border-border/60">
      <div
        className={cn(
          'flex items-center justify-between',
          sidebarSwapExpanded && 'mb-2.5'
        )}
      >
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {sidebarSwapExpanded ? (
            <ChevronDown size={10} />
          ) : (
            <ChevronUp size={10} />
          )}
          <Shuffle size={13} className="text-emerald-500" />
          Quick Swap
        </button>
        <span className="text-[10px] text-muted-foreground/50">
          {sidebarSwapExpanded ? `${feePercent}% fee` : 'LN → BTC'}
        </span>
      </div>

      {sidebarSwapExpanded && (
        <>
          <SwapWidget max={max} min={min} />

          <div className="mt-2 text-center">
            <a
              href="https://boltz.exchange/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              Powered by Boltz
            </a>
          </div>
        </>
      )}
    </div>
  );
};
