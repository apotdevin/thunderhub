import { Zap, Anchor } from 'lucide-react';
import { Price } from '../../../components/price/Price';
import { addEllipsis } from '../../../components/generic/helpers';
import { useNodeInfo } from '../../../hooks/UseNodeInfo';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface NodeInfoProps {
  isOpen?: boolean;
  isBurger?: boolean;
}

export const NodeInfo = ({ isBurger }: NodeInfoProps) => {
  const { alias, color, syncedToChain, currentBlockHeight, latestBlockHeight } =
    useNodeInfo();

  const { onchain, lightning } = useNodeBalances();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  const syncPercentage =
    !!latestBlockHeight && currentBlockHeight > 0
      ? Math.min(Math.round((currentBlockHeight / latestBlockHeight) * 100), 99)
      : null;

  if (!alias) return null;

  if (isBurger) {
    return (
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div
            className="w-0.5 h-4 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold text-sm">{addEllipsis(alias)}</span>
          <Badge
            variant={syncedToChain ? 'secondary' : 'destructive'}
            className={cn(
              'text-[10px] rounded-sm',
              syncedToChain &&
                'bg-green-500/10 text-green-600 dark:text-green-400'
            )}
          >
            {syncedToChain ? (
              'Synced'
            ) : (
              <>
                <Spinner className="size-3" />
                {syncPercentage ? `${syncPercentage}%` : 'Syncing'}
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Zap
              size={14}
              color={channelPending === 0 ? '#FFD300' : '#652EC7'}
              fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
            />
            <Price amount={totalLightning} />
          </div>
          <div className="flex items-center gap-1">
            <Anchor
              size={14}
              color={chainPending === 0 ? '#FFD300' : '#652EC7'}
            />
            <Price amount={totalChain} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
