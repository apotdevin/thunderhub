import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetFeeHealthQuery } from 'src/graphql/queries/__generated__/getFeeHealth.generated';
import { Card, SubCard } from 'src/components/generic/Styled';
import { useStatsDispatch } from './context';

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
        <SubCard key={channel.id}>
          <div>{channel.myScore}</div>
          {channel.partnerScore}
        </SubCard>
      ))}
    </Card>
  );
};
