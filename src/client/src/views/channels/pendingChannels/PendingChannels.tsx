import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetPendingChannelsQuery } from '../../../graphql/queries/__generated__/getPendingChannels.generated';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { PendingCard } from './PendingCard';

export const PendingChannels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetPendingChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getPendingChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      {data.getPendingChannels.map((channel, index: number) => (
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
