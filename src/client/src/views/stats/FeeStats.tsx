import { useState, useEffect } from 'react';
import { useGetFeeHealthQuery } from '../../graphql/queries/__generated__/getFeeHealth.generated';
import { ChannelFeeHealth } from '../../graphql/types';
import { sortBy } from 'lodash';
import { useStatsDispatch } from './context';
import { useChartColors } from '../../lib/chart-colors';
import { StatWrapper } from './Wrapper';
import { getIcon, getFeeMessage, getScoreBadgeClass } from './helpers';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

type FeeStatCardProps = {
  channel: ChannelFeeHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
  myStats?: boolean;
};

const FeeStatCard = ({
  channel,
  myStats,
  open,
  openSet,
  index,
}: FeeStatCardProps) => {
  const chartColors = useChartColors();
  const stats = myStats ? channel.mySide : channel.partnerSide;
  const { score } = stats || {};

  return (
    <div className="rounded-md border border-border bg-card transition-colors hover:bg-muted/30">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => openSet(open ? 0 : index)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">
            {channel?.partner?.node?.alias || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${getScoreBadgeClass(score)}`}
          >
            {getIcon(score, chartColors)}
            {score}
          </span>
          {open ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>
      {open && <FeeDetails stats={stats} />}
    </div>
  );
};

const FeeDetails = ({
  stats,
}: {
  stats: ChannelFeeHealth['partnerSide'] | null | undefined;
}) => {
  if (!stats) return null;
  const { rate, base, rateScore, baseScore, rateOver, baseOver } = stats;

  const rateMessage = getFeeMessage(rateScore, rateOver);
  const baseMessage = getFeeMessage(Number(baseScore), baseOver, true);

  return (
    <div className="px-4 pb-3">
      <Separator className="mb-3" />
      <div className="flex flex-col gap-2 mb-3">
        {rateMessage && (
          <p className="text-xs text-muted-foreground">{rateMessage}</p>
        )}
        {baseMessage && (
          <p className="text-xs text-muted-foreground">{baseMessage}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Fee Rate
          </span>
          <span className="text-sm font-mono font-medium">
            {rate ?? '—'}{' '}
            <span className="text-[10px] text-muted-foreground">ppm</span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Base Fee
          </span>
          <span className="text-sm font-mono font-medium">
            {base ?? '—'}{' '}
            <span className="text-[10px] text-muted-foreground">sats</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const FeeStats = () => {
  const [open, openSet] = useState(0);
  const [openTwo, openTwoSet] = useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetFeeHealthQuery();

  useEffect(() => {
    if (data?.getFeeHealth) {
      dispatch({
        type: 'change',
        state: { feeScore: data.getFeeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data?.getFeeHealth?.channels?.length) {
    return null;
  }

  const sortedArray = sortBy(
    data.getFeeHealth.channels,
    c => c?.partnerSide?.score
  );
  const sortedArrayMyStats = sortBy(
    data.getFeeHealth.channels,
    c => c?.mySide?.score
  );

  return (
    <>
      <StatWrapper
        title="Partner Fee Stats"
        icon={<DollarSign size={16} className="text-muted-foreground" />}
        count={sortedArray.length}
      >
        {sortedArray.map((channel, index) => (
          <FeeStatCard
            key={channel?.id || ''}
            channel={channel as ChannelFeeHealth}
            open={index + 1 === open}
            openSet={openSet}
            index={index + 1}
          />
        ))}
      </StatWrapper>
      <StatWrapper
        title="My Fee Stats"
        icon={<DollarSign size={16} className="text-muted-foreground" />}
        count={sortedArrayMyStats.length}
      >
        {sortedArrayMyStats.map((channel, index) => (
          <FeeStatCard
            key={channel?.id || ''}
            channel={channel as ChannelFeeHealth}
            myStats
            open={index + 1 === openTwo}
            openSet={openTwoSet}
            index={index + 1}
          />
        ))}
      </StatWrapper>
    </>
  );
};
