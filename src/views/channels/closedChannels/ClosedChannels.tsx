import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetClosedChannelsQuery } from 'src/graphql/queries/__generated__/getClosedChannels.generated';
import { ClosedChannelType } from 'src/graphql/types';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { ClosedCard } from './ClosedCard';

export const ClosedChannels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetClosedChannelsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getClosedChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      {data.getClosedChannels.map((channel, index) => (
        <ClosedCard
          channelInfo={channel as ClosedChannelType}
          key={index}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
        />
      ))}
    </Card>
  );
};
