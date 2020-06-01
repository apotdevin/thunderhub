import { getPeers, getNode, removePeer, addPeer } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';

interface PeerProps {
  bytes_received: number;
  bytes_sent: number;
  is_inbound: boolean;
  is_sync_peer: boolean;
  ping_time: number;
  public_key: string;
  socket: string;
  tokens_received: number;
  tokens_sent: number;
}

export const peerResolvers = {
  Query: {
    getPeers: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getPeers');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const { peers }: { peers: PeerProps[] } = await getPeers({
          lnd,
        });

        const getPeerList = () =>
          Promise.all(
            peers.map(async peer => {
              try {
                const nodeInfo = await getNode({
                  lnd,
                  is_omitting_channels: true,
                  public_key: peer.public_key,
                });

                return {
                  ...peer,
                  partner_node_info: {
                    ...nodeInfo,
                  },
                };
              } catch (error) {
                return { ...peer, partner_node_info: {} };
              }
            })
          );

        const peerList = await getPeerList();
        return peerList;
      } catch (error) {
        logger.error('Error getting peers: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
  Mutation: {
    addPeer: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'addPeer');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const success: boolean = await addPeer({
          lnd,
          public_key: params.publicKey,
          socket: params.socket,
          is_temporary: params.isTemporary,
        });
        return success;
      } catch (error) {
        logger.error('Error adding peer: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    removePeer: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'removePeer');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const success: boolean = await removePeer({
          lnd,
          public_key: params.publicKey,
        });
        return success;
      } catch (error) {
        logger.error('Error removing peer: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
};
