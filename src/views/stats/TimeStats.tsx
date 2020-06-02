import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetTimeHealthQuery } from 'src/graphql/queries/__generated__/getTimeHealth.generated';
import { Card, SubCard } from 'src/components/generic/Styled';
import { useStatsDispatch } from './context';

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
        <SubCard key={channel.id}>{channel.score}</SubCard>
      ))}
    </Card>
  );
};
