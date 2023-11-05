import { GetClosedChannelsQuery } from '../../../../graphql/queries/__generated__/getClosedChannels.generated';

export const getAliasFromClosedChannels = (
  channelId: string,
  channels: GetClosedChannelsQuery['getClosedChannels']
): { alias: string; closed: boolean } => {
  if (!channels) return { alias: 'Unknown', closed: false };

  const channel = channels.find(c => c?.id === channelId);

  if (channel?.partner_node_info.node?.alias) {
    return { alias: channel.partner_node_info.node.alias, closed: true };
  }

  return { alias: 'Unknown', closed: false };
};
