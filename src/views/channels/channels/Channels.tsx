import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { useConfigState } from 'src/context/ConfigContext';
import { sortBy } from 'underscore';
import { getPercent } from 'src/utils/helpers';
import { Card } from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { ChannelCard } from './ChannelCard';

export const Channels: React.FC = () => {
  const { sortDirection, channelSort } = useConfigState();
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
    const { local_balance, remote_balance, partner_node_info = {} } = channel;

    const { capacity, channel_count, base_fee, fee_rate } = partner_node_info;
    const partner = Number(capacity) || 0;
    const channels = Number(channel_count) || 0;

    const max = Math.max(local_balance, remote_balance);

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

  const getChannels = () => {
    switch (channelSort) {
      case 'local': {
        const newArray = sortBy(data.getChannels, 'local_balance');
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'balance': {
        const newArray = sortBy(data.getChannels, channel =>
          getPercent(channel.local_balance, channel.remote_balance)
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'feeRate': {
        const newArray = sortBy(
          data.getChannels,
          channel => channel.partner_node_info.fee_rate
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      default:
        return data.getChannels;
    }
  };

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      {getChannels().map((channel, index: number) => (
        <ChannelCard
          channelInfo={channel}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
          key={`${index}-${channel.id}`}
          biggest={biggest}
          biggestPartner={biggestPartner}
          mostChannels={mostChannels}
          biggestBaseFee={Math.max(biggestBaseFee, 100000)}
          biggestRateFee={Math.max(biggestRateFee, 2000)}
        />
      ))}
    </Card>
  );
};
