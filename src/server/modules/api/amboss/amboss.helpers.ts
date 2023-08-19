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
