import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetFeeHealthQuery } from 'src/graphql/queries/__generated__/getFeeHealth.generated';
import {
  Card,
  SubCard,
  SingleLine,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { ChannelFeeHealth } from 'src/graphql/types';
import { useStatsDispatch } from './context';
import { ScoreColumn, ScoreLine } from './styles';

type FeeStatCardProps = {
  channel: ChannelFeeHealth;
};

const FeeStatCard = ({ channel }: FeeStatCardProps) => {
  return (
    <SubCard key={channel.id}>
      <SingleLine>
        {channel?.partner?.node?.alias}
        <ScoreColumn>
          <ScoreLine>
            <DarkSubTitle>My Score</DarkSubTitle>
            {channel.myScore}
          </ScoreLine>
          <ScoreLine>
            <DarkSubTitle>Partner Score</DarkSubTitle>
            {channel.partnerScore}
          </ScoreLine>
        </ScoreColumn>
      </SingleLine>
    </SubCard>
  );
};

export const FeeStats = () => {
  const dispatch = useStatsDispatch();
  const { auth } = useAccountState();
  const { data, loading } = useGetFeeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  React.useEffect(() => {
    if (data && data.getFeeHealth) {
      dispatch({
        type: 'change',
        state: { feeScore: data.getFeeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data || !data.getFeeHealth) {
    return null;
  }

  return (
    <Card>
      {data.getFeeHealth.channels.map(channel => (
        <FeeStatCard key={channel.id} channel={channel} />
      ))}
    </Card>
  );
};
