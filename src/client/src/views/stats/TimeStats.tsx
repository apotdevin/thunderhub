import { useState, useEffect } from 'react';
import { useGetTimeHealthQuery } from '../../graphql/queries/__generated__/getTimeHealth.generated';
import { ChannelTimeHealth } from '../../graphql/types';
import { sortBy } from 'lodash';
import { formatSeconds } from '../../utils/helpers';
import { useStatsDispatch } from './context';
import { useChartColors } from '../../lib/chart-colors';
import { getIcon, getTimeMessage, getScoreBadgeClass } from './helpers';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

type TimeStatCardProps = {
  channel: ChannelTimeHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
};

const TimeStatCard = ({ channel, open, openSet, index }: TimeStatCardProps) => {
  const chartColors = useChartColors();
  const message = getTimeMessage(channel.score);

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
          {!channel.significant && (
            <AlertTriangle size={12} className="text-amber-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${getScoreBadgeClass(channel.score)}`}
          >
            {getIcon(channel.score, chartColors, !channel.significant)}
            {channel.score}
          </span>
          {open ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>
      {open && (
        <div className="px-4 pb-3">
          <Separator className="mb-3" />
          {!channel.significant && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
              Needs longer monitoring for significant statistics.
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-2">{message}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Monitored
              </span>
              <span className="text-sm font-mono font-medium">
                {formatSeconds(channel.monitoredTime)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Uptime
              </span>
              <span className="text-sm font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {formatSeconds(channel.monitoredUptime)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Downtime
              </span>
              <span className="text-sm font-mono font-medium text-red-600 dark:text-red-400">
                {formatSeconds(channel.monitoredDowntime)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TimeStats = () => {
  const [open, openSet] = useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetTimeHealthQuery();

  useEffect(() => {
    if (data?.getTimeHealth) {
      dispatch({
        type: 'change',
        state: { timeScore: data.getTimeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data?.getTimeHealth?.channels?.length) {
    return null;
  }

  const sortedArray = sortBy(data.getTimeHealth.channels, 'score');

  return (
    <div className="flex flex-col gap-2">
      {sortedArray.map((channel, index) => (
        <TimeStatCard
          key={channel?.id || ''}
          channel={channel as ChannelTimeHealth}
          open={index + 1 === open}
          openSet={openSet}
          index={index + 1}
        />
      ))}
    </div>
  );
};
