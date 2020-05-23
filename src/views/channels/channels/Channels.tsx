import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { ChannelCard } from './ChannelCard';

export const Channels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { auth } = useAccountState();

  const { loading, data } = useGetChannelsQuery({
    skip: !auth,
    variables: { auth },
    errorPolicy: 'all',
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getChannels) {
    return <LoadingCard noTitle={true} />;
  }

  let biggest = 0;
  let biggestPartner = 0;
  let mostChannels = 0;
  let biggestBaseFee = 0;
  let biggestRateFee = 0;

  for (let i = 0; i < data.getChannels.length; i++) {
    const channel = data.getChannels[i];
    const {
      local_balance,
      remote_balance,
      sent,
      received,
      partner_node_info = {},
    } = channel;

    const { capacity, channel_count, base_fee, fee_rate } = partner_node_info;
    const partner = Number(capacity) || 0;
    const channels = Number(channel_count) || 0;

    const max = Math.max(local_balance, remote_balance, sent, received);

    if (max > biggest) {
      biggest = max;
    }
    if (partner > biggestPartner) {
      biggestPartner = partner;
    }
    if (channels > mostChannels) {
      mostChannels = channels;
    }
    if (base_fee > biggestBaseFee) {
      biggestBaseFee = base_fee;
    }
    if (fee_rate > biggestRateFee) {
      biggestRateFee = fee_rate;
    }
  }

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      {data.getChannels.map((channel, index: number) => (
        <ChannelCard
          channelInfo={channel}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
          key={`${index}-${channel.id}`}
          biggest={biggest}
          biggestPartner={biggestPartner}
          mostChannels={mostChannels}
          biggestBaseFee={biggestBaseFee * 2}
          biggestRateFee={biggestRateFee}
        />
      ))}
    </Card>
  );
};
