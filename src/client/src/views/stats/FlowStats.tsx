import { useState, useEffect } from 'react';
import { useGetVolumeHealthQuery } from '../../graphql/queries/__generated__/getVolumeHealth.generated';
import { sortBy } from 'lodash';
import { ChannelHealth } from '../../graphql/types';
import { useStatsDispatch } from './context';
import { useChartColors } from '../../lib/chart-colors';
import { StatWrapper } from './Wrapper';
import { getIcon, getVolumeMessage, getScoreBadgeClass } from './helpers';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

type VolumeStatCardProps = {
  channel: ChannelHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
};

const VolumeStatCard = ({
  channel,
  open,
  openSet,
  index,
}: VolumeStatCardProps) => {
  const chartColors = useChartColors();
  const message = getVolumeMessage(channel.score);

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
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${getScoreBadgeClass(channel.score)}`}
          >
            {getIcon(channel.score, chartColors)}
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
          <p className="text-xs text-muted-foreground mb-2">{message}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Flow
              </span>
              <span className="text-sm font-mono font-medium">
                {channel.volumeNormalized ?? '—'}{' '}
                <span className="text-[10px] text-muted-foreground">
                  sats/block
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Avg Flow
              </span>
              <span className="text-sm font-mono font-medium">
                {channel.averageVolumeNormalized ?? '—'}{' '}
                <span className="text-[10px] text-muted-foreground">
                  sats/block
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const VolumeStats = () => {
  const [open, openSet] = useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetVolumeHealthQuery();

  useEffect(() => {
    if (data?.getVolumeHealth) {
      dispatch({
        type: 'change',
        state: { volumeScore: data.getVolumeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data?.getVolumeHealth?.channels?.length) {
    return null;
  }

  const sortedArray = sortBy(data.getVolumeHealth.channels, 'score');

  return (
    <StatWrapper
      title="Flow Stats"
      icon={<BarChart3 size={16} className="text-muted-foreground" />}
      count={sortedArray.length}
    >
      {sortedArray.map((channel, index) => (
        <VolumeStatCard
          key={channel?.id || ''}
          channel={channel as ChannelHealth}
          open={index + 1 === open}
          openSet={openSet}
          index={index + 1}
        />
      ))}
    </StatWrapper>
  );
};
