import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from '../../../context/AccountContext';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetPendingChannelsQuery } from '../../../generated/graphql';
import { PendingCard } from './PendingCard';

export const PendingChannels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { auth } = useAccount();

  const { loading, data } = useGetPendingChannelsQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getPendingChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card>
      {data.getPendingChannels.map((channel: any, index: number) => (
        <PendingCard
          channelInfo={channel}
          key={index}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
        />
      ))}
    </Card>
  );
};
