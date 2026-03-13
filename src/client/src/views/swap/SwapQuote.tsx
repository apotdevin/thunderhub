import {
  renderLine,
  getNodeLink,
  getAddressLink,
} from '../../components/generic/helpers';
import { Separation } from '../../components/generic/Styled';
import { Price } from '../../components/price/Price';
import { Pay } from '../home/account/pay/Pay';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { Info, ArrowDown } from 'lucide-react';

export const SwapQuote = () => {
  const { swaps, open } = useSwapsState();
  const dispatch = useSwapsDispatch();

  if (typeof open !== 'number') {
    return null;
  }

  const openSwap = swaps[open];

  if (!openSwap?.decodedInvoice) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
        <Info className="mr-2" size={14} />
        Error decoding invoice in swap.
      </div>
    );
  }

  const { decodedInvoice, onchainAmount, receivingAddress, invoice } = openSwap;

  const handlePaid = () => {
    dispatch({ type: 'close' });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">Swap Quote</h3>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {openSwap.id}
        </p>
      </div>

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

      <Separation />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Pay Invoice
        </h4>
        <Pay predefinedRequest={invoice} payCallback={handlePaid} />
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center text-xs text-amber-600 dark:text-amber-400">
        It is ok to close this modal after 5 seconds of having paid even if it
        still shows as loading.
      </div>
    </div>
  );
};
