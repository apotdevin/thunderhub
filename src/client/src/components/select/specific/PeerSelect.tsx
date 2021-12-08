import React from 'react';
import { useGetPeersQuery } from '../../../../src/graphql/queries/__generated__/getPeers.generated';
import { shorten } from '../../../../src/components/generic/helpers';
import { PeerType } from '../../../../src/graphql/types';
import { SelectWithDeco } from '../SelectWithDeco';
import { ValueProp } from '..';

type PeerSelectProps = {
  title: string;
  isMulti?: boolean;
  callback: (peer: PeerType[]) => void;
};

export const PeerSelect = ({ title, isMulti, callback }: PeerSelectProps) => {
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

  const handleChange = (value: ValueProp[]) => {
    const finalPeers = value
      .map(v => {
        const peer = peers.find(p => p?.public_key === v.value);
        return peer ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      callback(finalPeers as PeerType[]);
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
    />
  );
};
