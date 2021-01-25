import React from 'react';
import { shorten } from 'src/components/generic/helpers';
import { ChannelType } from 'src/graphql/types';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { ValueProp } from 'src/components/select';
import { SelectWithDecoAndValue } from 'src/components/select/SelectWithDeco';
import sortBy from 'lodash.sortby';
import groupBy from 'lodash.groupby';
import { ChannelInfo } from './ChannelInfo';

type ChannelSelectProps = {
  inThroughId: string;
  outThroughId: string;
  inCallback: (peer: ChannelType[]) => void;
  outCallback: (peer: ChannelType[]) => void;
};

type OptionsItem = ValueProp & {
  local: number;
  remote: number;
  baseFee: number;
  feeRate: number;
};

export type ReducedOptionsItem = OptionsItem & {
  percent: number;
  amount: number;
};

export const PeerSelection = ({
  inThroughId,
  outThroughId,
  inCallback,
  outCallback,
}: ChannelSelectProps) => {
  const { data, loading } = useGetChannelsQuery();

  const channels = data?.getChannels || [];

  const options: OptionsItem[] = channels.reduce<OptionsItem[]>(
    (p, channel) => {
      if (!channel?.partner_public_key) {
        return p;
      }

      let label = `${shorten(channel.partner_public_key)}`;

      if (
        channel.partner_node_info.node.alias &&
        channel.partner_node_info.node.alias !== 'Node not found'
      ) {
        label = `${channel.partner_node_info.node.alias} (${shorten(
          channel.partner_public_key
        )})`;
      }

      const feeRate =
        channel.partner_fee_info?.partner_node_policies?.fee_rate || 0;
      const baseFee = Math.round(
        (Number(
          channel.partner_fee_info?.partner_node_policies?.base_fee_mtokens
        ) || 0) / 1000
      );

      const newArray = [
        ...p,
        {
          value: channel.partner_public_key,
          label,
          local: channel.local_balance,
          remote: channel.remote_balance,
          baseFee,
          feeRate,
        },
      ];

      return newArray;
    },
    []
  );

  const grouped = groupBy(options, 'value');

  const finalOptions: ReducedOptionsItem[] = [];

  const keys = Object.keys(grouped);

  keys.forEach(k => {
    const peer = grouped[k];
    if (!peer) return;

    const count = peer.length;

    const reduced = peer.reduce<OptionsItem>(
      (p, v) => ({
        value: v.value,
        label: v.label,
        local: p.local + v.local,
        remote: p.remote + v.remote,
        baseFee: p.baseFee + v.baseFee,
        feeRate: p.feeRate + v.feeRate,
      }),
      { value: '', label: '', local: 0, remote: 0, baseFee: 0, feeRate: 0 }
    );

    const percent = Math.round(
      (reduced.local / (reduced.local + reduced.remote)) * 100
    );

    const peerInfo: ReducedOptionsItem = {
      ...reduced,
      label: `${reduced.label} - Local/Total: ${percent}%`,
      percent,
      amount: count,
      baseFee: reduced.baseFee / count,
      feeRate: reduced.feeRate / count,
    };

    finalOptions.push(peerInfo);
  });

  const outOptions = finalOptions.filter(o => o.value !== inThroughId);
  const inOptions = finalOptions.filter(o => o.value !== outThroughId);

  const outThrough = finalOptions.find(c => c.value === outThroughId);
  const inThrough = finalOptions.find(c => c.value === inThroughId);

  const handleChange = (incoming: boolean) => (value: ValueProp[]) => {
    if (!value.filter(Boolean).length) {
      if (incoming) {
        inCallback([]);
      } else {
        outCallback([]);
      }
      return;
    }
    const finalPeers = value
      .map(v => {
        const peer = channels.find(p => p?.partner_public_key === v.value);
        return peer ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      if (incoming) {
        inCallback(finalPeers as ChannelType[]);
      } else {
        outCallback(finalPeers as ChannelType[]);
      }
    } else {
      if (incoming) {
        inCallback([]);
      } else {
        outCallback([]);
      }
    }
  };

  return (
    <>
      <SelectWithDecoAndValue
        value={outThrough}
        loading={loading}
        title={'Outgoing'}
        options={sortBy(outOptions, ['percent']).reverse()}
        callback={handleChange(false)}
      />
      <ChannelInfo channel={outThrough} />
      <SelectWithDecoAndValue
        value={inThrough}
        loading={loading}
        title={'Incoming'}
        options={sortBy(inOptions, ['percent'])}
        callback={handleChange(true)}
      />
      <ChannelInfo channel={inThrough} incoming={true} />
    </>
  );
};
