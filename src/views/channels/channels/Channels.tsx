import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { useConfigState } from 'src/context/ConfigContext';
import { sortBy } from 'underscore';
import { getPercent } from 'src/utils/helpers';
import { ChannelType } from 'src/graphql/types';
import { useRebalanceState } from 'src/context/RebalanceContext';
import { useRouter } from 'next/router';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { ChannelCard } from './ChannelCard';
import { ChannelGoToToast } from './Channel.style';

export const WUMBO_MIN_SIZE = 16000000;

export const Channels: React.FC = () => {
  const toastId = useRef<any>(null);
  const { push } = useRouter();

  const { sortDirection, channelSort, maxSatValue } = useConfigState();
  const [indexOpen, setIndexOpen] = useState(0);

  const { inChannel, outChannel } = useRebalanceState();
  const hasIn = !!inChannel;
  const hasOut = !!outChannel;

  useEffect(() => {
    if (hasIn && hasOut) {
      toastId.current = toast.info(
        <ChannelGoToToast>Click to go to rebalancing</ChannelGoToToast>,
        {
          position: 'bottom-right',
          autoClose: false,
          closeButton: false,
          onClick: () => push('/rebalance'),
        }
      );
    }
    if (!hasIn || !hasOut) {
      toast.dismiss(toastId.current);
    }
    return () => {
      toast.dismiss();
    };
  }, [hasIn, hasOut, push]);

  const { loading, data } = useGetChannelsQuery({
    errorPolicy: 'all',
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data?.getChannels) {
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
      partner_node_info,
      partner_fee_info = {},
    } = channel || {};

    const { capacity, channel_count } = partner_node_info?.node || {};
    const { base_fee_mtokens, fee_rate } =
      partner_fee_info?.partner_node_policies || {};

    const { base_fee_mtokens: nodeBase, fee_rate: nodeRate } =
      partner_fee_info?.node_policies || {};

    const partner = Number(capacity) || 0;
    const channels = Number(channel_count) || 0;

    let max = Math.max(local_balance || 0, remote_balance || 0);

    if (maxSatValue !== 'auto') {
      max = Math.min(max, maxSatValue);
    }

    if (max > biggest) {
      biggest = max;
    }
    if (partner > biggestPartner) {
      biggestPartner = partner;
    }
    if (channels > mostChannels) {
      mostChannels = channels;
    }
    if (Number(base_fee_mtokens) > biggestBaseFee) {
      biggestBaseFee = Number(base_fee_mtokens);
    }
    if (Number(nodeBase) > biggestBaseFee) {
      biggestBaseFee = Number(nodeBase);
    }
    if (fee_rate && fee_rate > biggestRateFee) {
      biggestRateFee = fee_rate;
    }
    if (nodeRate && nodeRate > biggestRateFee) {
      biggestRateFee = nodeRate;
    }
  }

  const getChannels = (): ChannelType[] => {
    const channels: ChannelType[] = data?.getChannels as ChannelType[];
    switch (channelSort) {
      case 'local': {
        const newArray = sortBy(channels, 'local_balance');
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'age': {
        const newArray = sortBy(channels, 'channel_age');
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'balance': {
        const newArray = sortBy(channels, channel =>
          getPercent(channel.local_balance, channel.remote_balance)
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'deviation': {
        const newArray = sortBy(channels, channel => {
          const { remote_balance, local_balance } = channel;

          const middle = (remote_balance + local_balance) / 2;

          const remoteDifference = Math.abs(remote_balance - middle);
          const localDifference = Math.abs(local_balance - middle);

          const maxDifference = Math.max(remoteDifference, localDifference);

          return maxDifference;
        });
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'partnerName': {
        const newArray = sortBy(channels, channel =>
          channel.partner_node_info.node.alias.toLowerCase()
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'size': {
        const newArray = sortBy(
          channels,
          channel => channel.remote_balance + channel.local_balance
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      case 'feeRate': {
        const newArray = sortBy(
          channels,
          channel => channel?.partner_fee_info?.partner_node_policies?.fee_rate
        );
        return sortDirection === 'increase' ? newArray : newArray.reverse();
      }
      default:
        return channels;
    }
  };

  return (
    <>
      {getChannels().map((channel, index) => (
        <ChannelCard
          channelInfo={channel as ChannelType}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
          key={`${index}-${channel.id}`}
          biggest={biggest}
          biggestPartner={biggestPartner}
          mostChannels={mostChannels}
          biggestBaseFee={Math.max(biggestBaseFee, 5000)}
          biggestRateFee={Math.max(Math.min(biggestRateFee, 10000), 2000)}
        />
      ))}
    </>
  );
};
