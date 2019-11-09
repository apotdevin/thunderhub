import { getWalletInfo } from "ln-service";
import { logger } from "../../../helpers/logger";
import { NodeInfoType } from "../../../schemaTypes/query/info/nodeInfo";
import { requestLimiter } from "../../../helpers/rateLimiter";

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
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "nodeInfo", 1, "1s");
    const { lnd } = context;

    try {
      const info: NodeInfoProps = await getWalletInfo({
        lnd: lnd
      });
      return {
        chains: info.chains,
        color: info.color,
        activeChannelsCount: info.active_channels_count,
        alias: info.alias,
        currentBlockHash: info.current_block_hash,
        currentBlockHeight: info.current_block_height,
        isSyncedToChain: info.is_synced_to_chain,
        isSyncedToGraph: info.is_synced_to_graph,
        latestBlockAt: info.latest_block_at,
        peersCount: info.peers_count,
        pendingChannelsCount: info.pending_channels_count,
        publicKey: info.public_key,
        uris: info.uris,
        version: info.version
      };
    } catch (error) {
      logger.error("Error getting node info: %o", error);
      throw new Error("Failed to get node info.");
    }
  }
};
