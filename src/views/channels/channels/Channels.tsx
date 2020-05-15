import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from '../../../context/AccountContext';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetChannelsQuery } from '../../../generated/graphql';
import { ChannelCard } from './ChannelCard';

export const Channels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { auth } = useAccount();

  const { loading, data } = useGetChannelsQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card>
      {data.getChannels.map((channel: any, index: number) => (
        <ChannelCard
          channelInfo={channel}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
          key={`${index}-${channel.id}`}
        />
      ))}
    </Card>
  );
};
