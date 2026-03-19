import { Loader2, Check, CircleDot, AlertTriangle } from 'lucide-react';
import type { SwapEntry } from '../../context/BoltzSwapContext';
import { BOLTZ_STATUS, isFailedStatus } from './boltzStatus';

export type SwapStep = 'quote' | 'paying' | 'claiming' | 'done' | 'error';

/** Derive a progress step from the swap's live status and claim state. */
export const getSwapStep = (swap: SwapEntry): SwapStep => {
  const status = swap.liveStatus?.status ?? null;
  const { claimState } = swap;

  if (claimState === 'claimed' || status === BOLTZ_STATUS.TX_CLAIMED) {
    return 'done';
  }
  if (claimState === 'failed' || isFailedStatus(status)) {
    return 'error';
  }
  if (claimState === 'claiming') {
    return 'claiming';
  }
  if (
    status === BOLTZ_STATUS.TX_MEMPOOL ||
    status === BOLTZ_STATUS.TX_CONFIRMED ||
    status === BOLTZ_STATUS.INVOICE_SETTLED
  ) {
    return 'claiming';
  }
  if (
    status === BOLTZ_STATUS.INVOICE_PENDING ||
    status === BOLTZ_STATUS.INVOICE_PAID ||
    status === BOLTZ_STATUS.INVOICE_SET
  ) {
    return 'paying';
  }
  if (status === BOLTZ_STATUS.SWAP_CREATED || !status) {
    return 'quote';
  }
  return 'paying';
};

const steps: { key: SwapStep; label: string }[] = [
  { key: 'quote', label: 'Quote' },
  { key: 'paying', label: 'Pay' },
  { key: 'claiming', label: 'Claim' },
  { key: 'done', label: 'Done' },
];

const stepIndex = (step: SwapStep) => steps.findIndex(s => s.key === step);

export const SwapProgressStepper = ({
  currentStep,
  error,
}: {
  currentStep: SwapStep;
  error?: string;
}) => {
  const currentIdx = stepIndex(currentStep);

  // Each step is flex-1, so circle centers are at 12.5%, 37.5%, 62.5%, 87.5%.
  // Lines connect between circle edges: offset by half the circle width (10px) from each center.
  const segmentCount = steps.length - 1;

  return (
    <div className="relative">
      {/* Connector lines — positioned between circle edges */}
      <div className="absolute top-2.5 left-0 right-0" style={{ height: 1 }}>
        {Array.from({ length: segmentCount }).map((_, i) => {
          const startPct = ((2 * i + 1) / (2 * steps.length)) * 100;
          const endPct = ((2 * i + 3) / (2 * steps.length)) * 100;
          // 10px = half of h-5 circle
          return (
            <div
              key={i}
              className={`absolute top-0 h-px ${
                currentIdx > i ? 'bg-emerald-500/40' : 'bg-border'
              }`}
              style={{
                left: `calc(${startPct}% + 10px)`,
                right: `calc(${100 - endPct}% + 10px)`,
              }}
            />
          );
        })}
      </div>
      {/* Step circles + labels */}
      <div className="relative flex items-start w-full">
        {steps.map((step, i) => {
          const isComplete = currentIdx > i;
          const isActive = currentIdx === i;
          const isError = currentStep === 'error' && i === currentIdx;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-0.5 flex-1 min-w-0"
            >
              <div
                className={`flex items-center justify-center h-5 w-5 rounded-full text-[9px] transition-colors ${
                  isError
                    ? 'bg-red-500/20 text-red-500'
                    : isComplete
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : isActive
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-muted text-muted-foreground/40'
                }`}
              >
                {isError ? (
                  <AlertTriangle size={10} />
                ) : isComplete ? (
                  <Check size={10} />
                ) : isActive ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <CircleDot size={8} />
                )}
              </div>
              <span
                className={`text-[9px] leading-none ${
                  isActive || isComplete
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {error && (
        <div className="text-[9px] text-red-500 mt-1 text-center">{error}</div>
      )}
    </div>
  );
};
