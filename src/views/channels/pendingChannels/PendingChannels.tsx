import React, { useState } from 'react';
import { Card } from '../../../components/generic/Styled';
import { PendingCard } from './PendingCard';
import { useAccount } from '../../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetPendingChannelsQuery } from '../../../generated/graphql';

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
