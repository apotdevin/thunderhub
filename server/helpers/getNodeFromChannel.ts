import { getNode, getChannel } from 'ln-service';
import { logger } from 'server/helpers/logger';
import { toWithError } from 'server/helpers/async';
import {
  LndObject,
  GetChannelType,
  GetNodeType,
} from 'server/types/ln-service.types';

const errorNode = {
  alias: 'Partner node not found',
  color: '#000000',
};

export const getNodeFromChannel = async (
  id: string,
  publicKey: string,
  lnd: LndObject | null
) => {
  const [channelInfo, channelError] = await toWithError(
    getChannel({
      lnd,
      id,
    })
  );

  if (channelError || !channelInfo) {
    logger.verbose(`Error getting channel with id ${id}: %o`, channelError);
    return errorNode;
  }

  const partnerPublicKey =
    (channelInfo as GetChannelType).policies[0].public_key !== publicKey
      ? (channelInfo as GetChannelType).policies[0].public_key
      : (channelInfo as GetChannelType).policies[1].public_key;

  const [nodeInfo, nodeError] = await toWithError(
    getNode({
      lnd,
      is_omitting_channels: true,
      public_key: partnerPublicKey,
    })
  );

  if (nodeError || !nodeInfo) {
    logger.verbose(
      `Error getting node with public key ${partnerPublicKey}: %o`,
      nodeError
    );
    return errorNode;
  }

  return {
    alias: (nodeInfo as GetNodeType).alias,
    color: (nodeInfo as GetNodeType).color,
  };
};
