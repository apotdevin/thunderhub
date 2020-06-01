import { gql } from 'apollo-server-micro';

export const nodeTypes = gql`
  type nodeInfoType {
    chains: [String]
    color: String
    active_channels_count: Int
    closed_channels_count: Int
    alias: String
    current_block_hash: String
    current_block_height: Boolean
    is_synced_to_chain: Boolean
    is_synced_to_graph: Boolean
    latest_block_at: String
    peers_count: Int
    pending_channels_count: Int
    public_key: String
    uris: [String]
    version: String
  }
`;
