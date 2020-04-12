import { GraphQLList } from 'graphql';
import { getPeers as getLnPeers, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';
import { PeerType } from '../../types/QueryType';

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

export const getPeers = {
  type: new GraphQLList(PeerType),
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getPeers');

    const lnd = getAuthLnd(params.auth);

    try {
      const { peers }: { peers: PeerProps[] } = await getLnPeers({
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
      params.logger && logger.error('Error getting peers: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
