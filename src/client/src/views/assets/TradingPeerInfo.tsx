import { FC } from 'react';
import { useTradingState } from '../../context/TradingContext';
import { ArrowUpDown, ExternalLink } from 'lucide-react';

/**
 * Placeholder peer info widget — shows selected offer details.
 * The actual channel readiness is in the order form.
 */
export const TradingPeerInfo: FC = () => {
  const { selectedOffer } = useTradingState();

  if (!selectedOffer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ArrowUpDown size={20} className="text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">
          Select an offer to see peer details
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Peer</span>
        <span className="font-mono truncate ml-2">
          {selectedOffer.node.alias || selectedOffer.node.pubkey?.slice(0, 20)}
        </span>
      </div>
      {selectedOffer.node.pubkey && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pubkey</span>
          <a
            href={`https://amboss.space/node/${selectedOffer.node.pubkey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono truncate ml-2 max-w-[200px] inline-flex items-center gap-1 text-primary hover:underline"
          >
            {selectedOffer.node.pubkey}
            <ExternalLink size={10} className="shrink-0" />
          </a>
        </div>
      )}
      {selectedOffer.asset?.symbol && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Asset</span>
          <span>{selectedOffer.asset.symbol}</span>
        </div>
      )}
      {selectedOffer.available.displayAmount && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Available</span>
          <span className="tabular-nums">
            {Number(selectedOffer.available.displayAmount).toLocaleString()}{' '}
            {selectedOffer.asset?.symbol}
          </span>
        </div>
      )}
    </div>
  );
};
