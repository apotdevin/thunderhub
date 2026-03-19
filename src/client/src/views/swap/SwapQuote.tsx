import {
  renderLine,
  getNodeLink,
  getAddressLink,
} from '../../components/generic/helpers';
import { Separator } from '@/components/ui/separator';
import { Price } from '../../components/price/Price';
import { Pay } from '../home/account/pay/Pay';
import {
  useBoltzSwaps,
  useBoltzSwapById,
} from '../../context/BoltzSwapContext';
import { SwapProgressStepper, getSwapStep } from './SwapProgress';
import { Info, ArrowDown } from 'lucide-react';

export const SwapQuote = () => {
  const { openSwapId } = useBoltzSwaps();
  const openSwap = useBoltzSwapById(openSwapId);

  if (!openSwapId || !openSwap) {
    return null;
  }

  if (!openSwap.decodedInvoice) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
        <Info className="mr-2" size={14} />
        Error decoding invoice in swap.
      </div>
    );
  }

  const { decodedInvoice, onchainAmount, receivingAddress, invoice } = openSwap;

  const maxFee = Math.min(
    10000,
    Math.max(100, Math.round(decodedInvoice.tokens * 0.005))
  );

  const step = getSwapStep(openSwap);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">Swap Quote</h3>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {openSwap.id}
        </p>
      </div>

      <SwapProgressStepper currentStep={step} />

      <div className="space-y-1 text-sm">
        {renderLine(
          'Sending to',
          getNodeLink(
            decodedInvoice.destination,
            decodedInvoice.destination_node?.node?.alias
          )
        )}
        {renderLine('Description', decodedInvoice.description)}
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Transaction Details
        </h4>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">You send</span>
          <span className="font-medium">
            <Price amount={decodedInvoice.tokens} />
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fees (Boltz + Chain)</span>
          <span className="font-medium text-amber-600 dark:text-amber-400">
            <Price amount={decodedInvoice.tokens - onchainAmount} />
          </span>
        </div>
        <div className="my-2 flex items-center gap-2">
          <div className="flex-1 h-px bg-border" />
          <ArrowDown size={12} className="text-muted-foreground" />
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lockup Value</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            <Price amount={onchainAmount} />
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">BTC Address</span>
          <span>{getAddressLink(receivingAddress)}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Pay Invoice
        </h4>
        <Pay
          predefinedRequest={invoice}
          defaultFee={maxFee}
          defaultPaths={10}
        />
      </div>
    </div>
  );
};
