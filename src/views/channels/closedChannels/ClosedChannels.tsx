import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from '../../../context/AccountContext';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetClosedChannelsQuery } from '../../../generated/graphql';
import { ClosedCard } from './ClosedCard';

export const ClosedChannels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { auth } = useAccount();

  const { loading, data } = useGetClosedChannelsQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getClosedChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card>
      {data.getClosedChannels.map((channel: any, index: number) => (
        <ClosedCard
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
