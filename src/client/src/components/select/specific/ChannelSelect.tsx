import React from 'react';
import { shorten } from '../../../../src/components/generic/helpers';
import { useGetChannelsWithPeersQuery } from '../../../../src/graphql/queries/__generated__/getChannels.generated';
import { SelectWithDeco } from '../SelectWithDeco';
import { Channel } from '../../../graphql/types';
import { ValueProp } from '..';

type ChannelSelectProps = {
  title: string;
  maxWidth?: string;
  callback: (peer: Channel[]) => void;
};

export const ChannelSelect = ({
  title,
  maxWidth,
  callback,
}: ChannelSelectProps) => {
  const { data, loading } = useGetChannelsWithPeersQuery();

  const channels = data?.getChannels || [];

  const options = channels
    .map(channel => {
      if (!channel?.partner_public_key) {
        return null;
      }

      const label = `${channel.id}
       ${
         channel?.partner_node_info?.node?.alias
           ? ` - ${channel.partner_node_info.node.alias}`
           : ''
       } - 
       ${shorten(channel.partner_public_key)}`;

      return {
        value: channel.partner_public_key,
        label,
      };
    })
    .filter(Boolean) as ValueProp[];

  const handleChange = (value: ValueProp[]) => {
    const finalPeers = value
      .map(v => {
        const peer = channels.find(p => p?.partner_public_key === v.value);
        return peer?.id ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      callback(finalPeers as Channel[]);
    } else {
      callback([]);
    }
  };

  return (
    <SelectWithDeco
      loading={loading}
      title={title}
      options={options}
      callback={handleChange}
      maxWidth={maxWidth}
    />
  );
};
