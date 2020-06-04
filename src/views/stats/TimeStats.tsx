import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetTimeHealthQuery } from 'src/graphql/queries/__generated__/getTimeHealth.generated';
import {
  Card,
  SubCard,
  SingleLine,
  SubTitle,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { ChannelTimeHealth } from 'src/graphql/types';
import { useStatsDispatch } from './context';
import { ScoreLine } from './styles';

type TimeStatCardProps = {
  channel: ChannelTimeHealth;
};

const TimeStatCard = ({ channel }: TimeStatCardProps) => {
  const renderScore = () => {
    if (channel.score <= 0) {
      return (
        <DarkSubTitle>Needs to be monitored for a longer period</DarkSubTitle>
      );
    }
    return (
      <ScoreLine>
        <DarkSubTitle>Score</DarkSubTitle>
        {channel.score}
      </ScoreLine>
    );
  };
  return (
    <SubCard key={channel.id}>
      <SingleLine>
        <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
        {renderScore()}
      </SingleLine>
    </SubCard>
  );
};

export const TimeStats = () => {
  const dispatch = useStatsDispatch();
  const { auth } = useAccountState();
  const { data, loading } = useGetTimeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  React.useEffect(() => {
    if (data && data.getTimeHealth) {
      dispatch({
        type: 'change',
        state: { timeScore: data.getTimeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data || !data.getTimeHealth) {
    return null;
  }

  return (
    <Card>
      {data.getTimeHealth.channels.map(channel => (
        <TimeStatCard key={channel.id} channel={channel} />
      ))}
    </Card>
  );
};
