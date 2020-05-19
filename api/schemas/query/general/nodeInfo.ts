import { getWalletInfo, getClosedChannels } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { NodeInfoType } from '../../types/QueryType';

interface NodeInfoProps {
  chains: string[];
  color: string;
  active_channels_count: number;
  alias: string;
  current_block_hash: string;
  current_block_height: number;
  is_synced_to_chain: boolean;
  is_synced_to_graph: boolean;
  latest_block_at: string;
  peers_count: number;
  pending_channels_count: number;
  public_key: string;
  uris: string[];
  version: string;
}

export const getNodeInfo = {
  type: NodeInfoType,
  args: defaultParams,
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'nodeInfo');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const info: NodeInfoProps = await getWalletInfo({
        lnd,
      });
      const closedChannels: { channels: [] } = await getClosedChannels({
        lnd,
      });
      return {
        ...info,
        closed_channels_count: closedChannels.channels.length,
      };
    } catch (error) {
      logger.error('Error getting node info: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
