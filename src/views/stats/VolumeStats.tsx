import * as React from 'react';
import { useGetVolumeHealthQuery } from 'src/graphql/queries/__generated__/getVolumeHealth.generated';
import { useAccountState } from 'src/context/AccountContext';
import {
  Card,
  SubCard,
  SingleLine,
  DarkSubTitle,
  SubTitle,
} from 'src/components/generic/Styled';
import { useStatsDispatch } from './context';
import { ScoreLine } from './styles';

export const VolumeStats = () => {
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

  return (
    <Card>
      {data.getVolumeHealth.channels.map(channel => (
        <SubCard key={channel.id}>
          <SingleLine>
            <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
            <ScoreLine>
              <DarkSubTitle>{'Score'}</DarkSubTitle>
              {channel.score}
            </ScoreLine>
          </SingleLine>
        </SubCard>
      ))}
    </Card>
  );
};
