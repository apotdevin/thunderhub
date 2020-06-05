import * as React from 'react';
import { useGetVolumeHealthQuery } from 'src/graphql/queries/__generated__/getVolumeHealth.generated';
import { useAccountState } from 'src/context/AccountContext';
import {
  SubCard,
  SingleLine,
  DarkSubTitle,
  SubTitle,
  Separation,
} from 'src/components/generic/Styled';
import { sortBy } from 'underscore';
import { renderLine } from 'src/components/generic/helpers';
import { ChannelHealth } from 'src/graphql/types';
import { useStatsDispatch } from './context';
import { ScoreLine, Clickable, WarningText } from './styles';
import { StatWrapper } from './Wrapper';
import { getIcon, getVolumeMessage, getProgressColor } from './helpers';

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
  const message = getVolumeMessage(channel.score);
  const renderContent = () => (
    <>
      <Separation />
      <WarningText warningColor={getProgressColor(channel.score)}>
        {message}
      </WarningText>
      {renderLine('Volume (sats/block):', channel.volumeNormalized)}
      {renderLine(
        'Average Volume (sats/block):',
        channel.averageVolumeNormalized
      )}
    </>
  );
  return (
    <SubCard key={channel.id}>
      <Clickable onClick={() => openSet(open ? 0 : index)}>
        <SingleLine>
          <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
          <ScoreLine>
            <DarkSubTitle>{'Score'}</DarkSubTitle>
            {channel.score}
            {getIcon(channel.score)}
          </ScoreLine>
        </SingleLine>
      </Clickable>
      {open && renderContent()}
    </SubCard>
  );
};

export const VolumeStats = () => {
  const [open, openSet] = React.useState(0);
  const dispatch = useStatsDispatch();
  const { auth } = useAccountState();
  const { data, loading } = useGetVolumeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  React.useEffect(() => {
    if (data && data.getVolumeHealth) {
      dispatch({
        type: 'change',
        state: { volumeScore: data.getVolumeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data || !data.getVolumeHealth) {
    return null;
  }

  const sortedArray = sortBy(data.getVolumeHealth.channels, 'score');

  return (
    <StatWrapper title={'Volume Stats'}>
      {sortedArray.map((channel, index) => (
        <VolumeStatCard
          key={channel.id}
          channel={channel}
          open={index + 1 === open}
          openSet={openSet}
          index={index + 1}
        />
      ))}
    </StatWrapper>
  );
};
