import React from 'react';
import { useGetPeersQuery } from 'src/graphql/queries/__generated__/getPeers.generated';
import { shorten } from 'src/components/generic/helpers';
import { PeerType } from 'src/graphql/types';
import { SelectWithDeco } from '../SelectWithDeco';
import { ValueProp } from '..';

type PeerSelectProps = {
  callback: (peer: PeerType) => void;
};

export const PeerSelect = ({ callback }: PeerSelectProps) => {
  const { data, loading } = useGetPeersQuery();

  const peers = data?.getPeers || [];

  const options = peers
    .map(peer => {
      if (!peer?.public_key) {
        return null;
      }
      let label = shorten(peer.public_key);

      if (
        peer.partner_node_info.node.alias &&
        peer.partner_node_info.node.alias !== 'Node not found'
      ) {
        label = `${peer.partner_node_info.node.alias} (${shorten(
          peer.public_key
        )})`;
      }

      return {
        value: peer.public_key,
        label,
      };
    })
    .filter(Boolean) as ValueProp[];

  const handleChange = (value: ValueProp) => {
    const peer = peers.find(p => p?.public_key === value.value);
    peer && callback(peer);
  };

  return (
    <SelectWithDeco
      loading={loading}
      title={'Node'}
      options={options}
      callback={handleChange}
    />
  );
};
