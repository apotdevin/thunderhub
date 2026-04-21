import { useSyncExternalStore } from 'react';
import { Zap, Anchor, Users, Radio, Wallet, Gauge } from 'lucide-react';
import { Price } from '../../components/price/Price';
import { useNodeInfo } from '../../hooks/UseNodeInfo';
import { useNodeBalances } from '../../hooks/UseNodeBalances';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import Big from 'big.js';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const subscribeToTheme = (cb: () => void) => {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
};
const getIsDark = () => document.documentElement.classList.contains('dark');
const useIsDarkTheme = () => useSyncExternalStore(subscribeToTheme, getIsDark);

const hexToRgb = (hex: string) => {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
};

const getLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

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

  const isDark = useIsDarkTheme();

  if (!alias) return null;

  const { r, g, b } = hexToRgb(color);
  const lum = getLuminance(color);

  // Mix color toward a target by amount (0 = original, 1 = target)
  const mixColor = (
    r: number,
    g: number,
    b: number,
    target: number,
    amount: number
  ) => ({
    r: Math.round(r + (target - r) * amount),
    g: Math.round(g + (target - g) * amount),
    b: Math.round(b + (target - b) * amount),
  });

  const getAliasStyle = () => {
    // Very light colors on light theme / very dark on dark theme: use foreground text
    if ((!isDark && lum > 0.85) || (isDark && lum < 0.15)) {
      return {
        backgroundColor: `rgba(${r},${g},${b},0.15)`,
        color: 'var(--color-foreground)',
      };
    }
    // Dark theme: lighten text (mix toward white)
    // Light theme: darken text (mix toward black)
    const target = isDark ? 255 : 0;
    const mixAmount = isDark
      ? Math.max(0.2, 0.85 - lum)
      : Math.max(0.2, lum - 0.15);
    const mixed = mixColor(r, g, b, target, mixAmount);
    return {
      backgroundColor: `rgba(${r},${g},${b},${lum < 0.3 ? 0.25 : 0.15})`,
      color: `rgb(${mixed.r},${mixed.g},${mixed.b})`,
    };
  };

  return (
    <div className="flex items-center h-9 text-xs text-muted-foreground overflow-x-auto">
      {/* Node alias */}
      <div
        className="flex items-center shrink-0 h-full pl-4 pr-6"
        style={{
          background: `linear-gradient(to right, ${getAliasStyle().backgroundColor}, transparent)`,
        }}
      >
        <span
          className="font-medium truncate max-w-35"
          style={{ color: getAliasStyle().color }}
        >
          {alias}
        </span>
      </div>

      <div className="flex items-center gap-5 px-4">
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
