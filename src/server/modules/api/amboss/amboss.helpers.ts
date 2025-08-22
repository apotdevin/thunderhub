import { GetChannelsResult } from 'lightning';

import { EdgeInfo, NodeAlias } from './amboss.types';

export const mapNodeResult = (
  pubkeys: string[],
  nodes: NodeAlias[]
): (NodeAlias | null)[] => {
  return pubkeys.map(pk => nodes.find(node => node.pub_key === pk) || null);
};

export const mapEdgeResult = (
  ids: string[],
  edges: EdgeInfo[]
): (EdgeInfo | null)[] => {
  return ids.map(
    pk => edges.find(edge => edge.short_channel_id === pk) || null
  );
};

export const getMappedChannelInfo = (
  info: GetChannelsResult
): {
  chan_id: string;
  balance: string;
  capacity: string;
}[] => {
  if (!info?.channels?.length) return [];
  return info.channels.map(c => {
    const heldAmount = c.pending_payments.reduce((p, pp) => {
      if (!pp) return p;
      if (!pp.is_outgoing) return p;
      return p + pp.tokens;
    }, 0);

    return {
      chan_id: c.id,
      balance: (c.local_balance + heldAmount).toString(),
      capacity: c.capacity + '',
    };
  });
};
