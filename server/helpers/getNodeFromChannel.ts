import { getNode, getChannel } from 'ln-service';
import { logger } from 'server/helpers/logger';
import { toWithError } from 'server/helpers/async';
import { LndObject } from 'server/types/ln-service.types';

const errorNode = {
  alias: 'Partner node not found',
  color: '#000000',
};

export const getNodeFromChannel = async (
  id: string,
  publicKey: string,
  lnd: LndObject
) => {
  const [channelInfo, channelError] = await toWithError(
    getChannel({
      lnd,
      id,
    })
  );

  if (channelError) {
    logger.verbose(`Error getting channel with id ${id}: %o`, channelError);
    return errorNode;
  }

  const partnerPublicKey =
    channelInfo.policies[0].public_key !== publicKey
      ? channelInfo.policies[0].public_key
      : channelInfo.policies[1].public_key;

  const [nodeInfo, nodeError] = await toWithError(
    getNode({
      lnd,
      is_omitting_channels: true,
      public_key: partnerPublicKey,
    })
  );

  if (nodeError) {
    logger.verbose(
      `Error getting node with public key ${partnerPublicKey}: %o`,
      nodeError
    );
    return errorNode;
  }

  return {
    alias: nodeInfo.alias,
    color: nodeInfo.color,
  };
};
