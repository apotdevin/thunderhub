import { getChannel, getNode } from 'ln-service';
import { toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import {
  ChannelType,
  GetChannelType,
  GetNodeType,
} from 'server/types/ln-service.types';

export const getNodeFromChannel = async (
  lnd: {},
  channelId: string,
  public_key: string,
  closedChannels: ChannelType[]
) => {
  const closedChannel = closedChannels.find(c => c.id === channelId);

  if (closedChannel) {
    const [nodeInfo, nodeError] = await toWithError<GetNodeType>(
      getNode({
        lnd,
        is_omitting_channels: true,
        public_key: closedChannel.partner_public_key,
      })
    );

    if (nodeError || !nodeInfo) {
      logger.error(
        `Unable to get node with public key: ${closedChannel.partner_public_key}. Error %o`,
        nodeError
      );
      return null;
    }

    return {
      ...nodeInfo,
      public_key: closedChannel.partner_public_key,
      channel_id: channelId,
    };
  }

  const [info, error] = await toWithError<GetChannelType>(
    getChannel({
      lnd,
      id: channelId,
    })
  );

  if (error || !info) {
    logger.error(
      `Unable to get channel with id: ${channelId}. Error %o`,
      error
    );
    return null;
  }

  const partner_node_policy = info.policies.find(
    policy => policy.public_key !== public_key
  );

  if (!partner_node_policy?.public_key) {
    logger.error(`Unable to get partner public key for channel: ${channelId}`);
    return null;
  }

  const [nodeInfo, nodeError] = await toWithError<GetNodeType>(
    getNode({
      lnd,
      is_omitting_channels: true,
      public_key: partner_node_policy?.public_key,
    })
  );

  if (nodeError || !nodeInfo) {
    logger.error(
      `Unable to get node with public key: ${partner_node_policy?.public_key}. Error %o`,
      nodeError
    );
    return null;
  }

  return {
    ...nodeInfo,
    public_key: partner_node_policy?.public_key,
    channel_id: channelId,
  };
};
