import { Fragment, useState, useEffect } from 'react';
import { useGetTimeHealthQuery } from '../../graphql/queries/__generated__/getTimeHealth.generated';
import {
  SubCard,
  SubTitle,
  DarkSubTitle,
  Separation,
  ResponsiveLine,
} from '../../components/generic/Styled';
import { ChannelTimeHealth } from '../../graphql/types';
import { sortBy } from 'lodash';
import { renderLine } from '../../components/generic/helpers';
import { formatSeconds } from '../../utils/helpers';
import { useStatsDispatch } from './context';
import { useChartColors } from '../../lib/chart-colors';
import { StatWrapper } from './Wrapper';
import { getIcon, getTimeMessage, getProgressColor } from './helpers';

type TimeStatCardProps = {
  channel: ChannelTimeHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
};

const TimeStatCard = ({ channel, open, openSet, index }: TimeStatCardProps) => {
  const chartColors = useChartColors();
  const message = getTimeMessage(channel.score);
  const renderContent = () => (
    <>
      <Separation />
      {!channel.significant && (
        <DarkSubTitle
          className="w-full text-center"
          style={{ color: chartColors.orange }}
        >
          Needs to be monitored for a longer period to give significant
          statistics.
        </DarkSubTitle>
      )}
      <DarkSubTitle
        className="w-full text-center"
        style={{
          color:
            getProgressColor(channel.score, chartColors) || chartColors.orange,
        }}
      >
        {message}
      </DarkSubTitle>
      {renderLine('Monitored time:', formatSeconds(channel.monitoredTime))}
      {renderLine('Monitored up time:', formatSeconds(channel.monitoredUptime))}
      {renderLine(
        'Monitored down time:',
        formatSeconds(channel.monitoredDowntime)
      )}
    </>
  );
  return (
    <Fragment key={channel.id || ''}>
      <SubCard>
        <div
          className="cursor-pointer"
          onClick={() => openSet(open ? 0 : index)}
        >
          <ResponsiveLine>
            <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
            <div className="flex justify-between mt-2 w-full md:mt-0 md:w-40">
              <DarkSubTitle>Score</DarkSubTitle>
              {channel.score}
              {getIcon(channel.score, chartColors, !channel.significant)}
            </div>
          </ResponsiveLine>
        </div>
        {open && renderContent()}
      </SubCard>
    </Fragment>
  );
};

export const TimeStats = () => {
  const [open, openSet] = useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetTimeHealthQuery();

  useEffect(() => {
    if (data && data.getTimeHealth) {
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
    <StatWrapper title={'Time Stats'}>
      {sortedArray.map((channel, index) => (
        <TimeStatCard
          key={channel?.id || ''}
          channel={channel as ChannelTimeHealth}
          open={index + 1 === open}
          openSet={openSet}
          index={index + 1}
        />
      ))}
    </StatWrapper>
  );
};
