import * as React from 'react';
import { useGetTimeHealthQuery } from 'src/graphql/queries/__generated__/getTimeHealth.generated';
import {
  SubCard,
  SubTitle,
  DarkSubTitle,
  Separation,
  ResponsiveLine,
} from 'src/components/generic/Styled';
import { ChannelTimeHealth } from 'src/graphql/types';
import { sortBy } from 'lodash';
import { renderLine } from 'src/components/generic/helpers';
import { formatSeconds } from 'src/utils/helpers';
import { useStatsDispatch } from './context';
import { ScoreLine, WarningText, Clickable } from './styles';
import { StatWrapper } from './Wrapper';
import { getIcon, getTimeMessage, getProgressColor } from './helpers';

type TimeStatCardProps = {
  channel: ChannelTimeHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
};

const TimeStatCard = ({ channel, open, openSet, index }: TimeStatCardProps) => {
  const message = getTimeMessage(channel.score);
  const renderContent = () => (
    <>
      <Separation />
      {!channel.significant && (
        <WarningText>
          Needs to be monitored for a longer period to give significant
          statistics.
        </WarningText>
      )}
      <WarningText warningColor={getProgressColor(channel.score)}>
        {message}
      </WarningText>
      {renderLine('Monitored time:', formatSeconds(channel.monitoredTime))}
      {renderLine('Monitored up time:', formatSeconds(channel.monitoredUptime))}
      {renderLine(
        'Monitored down time:',
        formatSeconds(channel.monitoredDowntime)
      )}
    </>
  );
  return (
    <React.Fragment key={channel.id || ''}>
      <SubCard>
        <Clickable onClick={() => openSet(open ? 0 : index)}>
          <ResponsiveLine>
            <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
            <ScoreLine>
              <DarkSubTitle>Score</DarkSubTitle>
              {channel.score}
              {getIcon(channel.score, !channel.significant)}
            </ScoreLine>
          </ResponsiveLine>
        </Clickable>
        {open && renderContent()}
      </SubCard>
    </React.Fragment>
  );
};

export const TimeStats = () => {
  const [open, openSet] = React.useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetTimeHealthQuery({ ssr: false });

  React.useEffect(() => {
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
