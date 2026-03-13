import { Zap, Anchor, Users, Radio, Wallet, Gauge } from 'lucide-react';
import { Price } from '../../components/price/Price';
import { useNodeInfo } from '../../hooks/UseNodeInfo';
import { useNodeBalances } from '../../hooks/UseNodeBalances';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import Big from 'big.js';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const NodeInfoBar = () => {
  const {
    alias,
    color,
    syncedToChain,
    currentBlockHeight,
    activeChannelCount,
    pendingChannelCount,
    closedChannelCount,
    peersCount,
    latestBlockHeight,
  } = useNodeInfo();

  const { onchain, lightning } = useNodeBalances();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();
  const totalBalance = new Big(totalChain).add(totalLightning).toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  const syncPercentage =
    !!latestBlockHeight && currentBlockHeight > 0
      ? Math.min(Math.round((currentBlockHeight / latestBlockHeight) * 100), 99)
      : null;

  const {
    fast,
    halfHour,
    hour,
    minimum,
    dontShow: dontShowFees,
  } = useBitcoinFees();

  if (!alias) return null;

  return (
    <div className="flex items-center h-9 text-xs text-muted-foreground overflow-x-auto">
      {/* Node color accent bar */}
      <div className="w-1 h-full shrink-0" style={{ backgroundColor: color }} />

      <div className="flex items-center gap-5 px-4">
        {/* Node alias */}
        <span className="font-medium text-foreground truncate max-w-[140px] shrink-0">
          {alias}
        </span>

        {/* Sync status badge */}
        <Badge
          variant={syncedToChain ? 'secondary' : 'destructive'}
          className={cn(
            'shrink-0 text-[10px] rounded-sm',
            syncedToChain &&
              'bg-green-500/10 text-green-600 dark:text-green-400'
          )}
        >
          {syncedToChain ? (
            'Synced'
          ) : (
            <>
              <Spinner className="size-3" />
              {syncPercentage ? `Syncing ${syncPercentage}%` : 'Syncing...'}
            </>
          )}
        </Badge>

        <div className="w-px h-3.5 bg-border shrink-0" />

        {/* Total balance */}
        <div className="flex items-center gap-1 shrink-0">
          <Wallet size={12} />
          <span className="text-foreground font-medium">Balance</span>
          <Price amount={totalBalance} />
        </div>

        {/* Lightning balance */}
        <div className="flex items-center gap-1 shrink-0">
          <Zap
            size={12}
            color={channelPending === 0 ? '#FFD300' : '#652EC7'}
            fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
          />
          <span className="text-foreground font-medium">Lightning</span>
          <Price amount={totalLightning} />
          {channelPending > 0 && (
            <span className="text-muted-foreground/60">
              (pending: <Price amount={String(lightning.pending)} />)
            </span>
          )}
        </div>

        {/* Chain balance */}
        <div className="flex items-center gap-1 shrink-0">
          <Anchor
            size={12}
            color={chainPending === 0 ? '#FFD300' : '#652EC7'}
          />
          <span className="text-foreground font-medium">On-chain</span>
          <Price amount={totalChain} />
          {chainPending > 0 && (
            <span className="text-muted-foreground/60">
              (pending: <Price amount={String(onchain.pending)} />)
            </span>
          )}
        </div>

        <div className="w-px h-3.5 bg-border shrink-0" />

        {/* Channels */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <Radio size={12} />
            <span className="text-foreground font-medium">Channels</span>
          </div>
          <span>{activeChannelCount} active</span>
          {pendingChannelCount > 0 && (
            <span className="text-muted-foreground/60">
              {pendingChannelCount} pending
            </span>
          )}
          {closedChannelCount > 0 && (
            <span className="text-muted-foreground/60">
              {closedChannelCount} closed
            </span>
          )}
        </div>

        <div className="w-px h-3.5 bg-border shrink-0" />

        {/* Peers */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span className="text-foreground font-medium">Peers</span>
          </div>
          <span>{peersCount} connected</span>
        </div>

        {/* Mempool Fees */}
        {!dontShowFees && (
          <>
            <div className="w-px h-3.5 bg-border shrink-0" />
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <Gauge size={12} />
                <span className="text-foreground font-medium">Fees</span>
              </div>
              <span>{fast} sat/vB</span>
              {halfHour !== fast && (
                <span className="text-muted-foreground/60">
                  30m: {halfHour}
                </span>
              )}
              <span className="text-muted-foreground/60">1h: {hour}</span>
              <span className="text-muted-foreground/60">min: {minimum}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
