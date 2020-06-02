import * as React from 'react';
import { useGetVolumeHealthQuery } from 'src/graphql/queries/__generated__/getVolumeHealth.generated';
import { useAccountState } from 'src/context/AccountContext';
import { Card, SubCard } from 'src/components/generic/Styled';
import { useStatsDispatch } from './context';

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
        <SubCard key={channel.id}>{channel.score}</SubCard>
      ))}
    </Card>
  );
};
