import React from 'react';
import { shorten } from '../../../../src/components/generic/helpers';
import { ChannelType } from '../../../../src/graphql/types';
import { useGetChannelsQuery } from '../../../../src/graphql/queries/__generated__/getChannels.generated';
import { SelectWithDeco } from '../SelectWithDeco';
import { ValueProp } from '..';

type ChannelSelectProps = {
  title: string;
  isMulti?: boolean;
  maxWidth?: string;
  callback: (peer: ChannelType[]) => void;
};

export const ChannelSelect = ({
  title,
  isMulti,
  maxWidth,
  callback,
}: ChannelSelectProps) => {
  const { data, loading } = useGetChannelsQuery();

  const channels = data?.getChannels || [];

  const options = channels
    .map(channel => {
      if (!channel?.partner_public_key) {
        return null;
      }
      let label = shorten(channel.partner_public_key);

      if (
        channel.partner_node_info.node.alias &&
        channel.partner_node_info.node.alias !== 'Node not found'
      ) {
        label = `${channel.partner_node_info.node.alias} (${shorten(
          channel.partner_public_key
        )})`;
      }

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
        return peer ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      callback(finalPeers as ChannelType[]);
    } else {
      callback([]);
    }
  };

  return (
    <SelectWithDeco
      isMulti={isMulti}
      loading={loading}
      title={title}
      options={options}
      callback={handleChange}
      maxWidth={maxWidth}
    />
  );
};
