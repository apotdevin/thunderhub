import React from 'react';
import { shorten } from '../../../../src/components/generic/helpers';
import { useGetChannelsQuery } from '../../../../src/graphql/queries/__generated__/getChannels.generated';
import { useGetPeerSwapPeersQuery } from '../../../../src/graphql/queries/__generated__/getPeerSwapPeers.generated';
import { SelectWithDeco } from '../SelectWithDeco';
import { ValueProp } from '..';
import { chanFormat } from 'bolt07';

type PeerSwapChannelSelectProps = {
  title: string;
  isMulti?: boolean;
  maxWidth?: string;
  callback: (channelId: string) => void;
};

export const ChannelSelect = ({
  title,
  isMulti,
  maxWidth,
  callback,
}: PeerSwapChannelSelectProps) => {
  const channelsQuery = useGetChannelsQuery();
  const peersQuery = useGetPeerSwapPeersQuery();

  const loading = channelsQuery.loading || peersQuery.loading;

  const peers = peersQuery.data?.getPeerSwapPeers.peers || [];
  const peer_swap_lookup = peers.reduce<Record<string, string>>(
    (acc, { channels }) => {
      for (const { channelId } of channels) {
        acc[chanFormat({ number: channelId }).channel] = channelId;
      }
      return acc;
    },
    {}
  );
  const channels = channelsQuery.data?.getChannels || [];
  const channels_filtered = channels.filter(
    x => typeof peer_swap_lookup[x.id] !== 'undefined'
  );

  const options = channels_filtered
    .map(channel => {
      if (!channel?.partner_public_key) {
        return null;
      }
      let label = shorten(channel.partner_public_key);

      if (channel.partner_node_info.node?.alias) {
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
    if (finalPeers.length && finalPeers[0] !== null) {
      callback(peer_swap_lookup[finalPeers[0].id]);
    } else {
      callback('');
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
