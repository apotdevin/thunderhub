import { gql } from 'apollo-server-micro';

export const nodeTypes = gql`
  type nodeType {
    alias: String!
    capacity: String
    channel_count: Int
    color: String
    updated_at: String
    public_key: String
  }

  type Node {
    node: nodeType!
  }

  type nodeInfoType {
    chains: [String!]!
    color: String!
    active_channels_count: Int!
    closed_channels_count: Int!
    alias: String!
    current_block_hash: String!
    current_block_height: Int!
    is_synced_to_chain: Boolean!
    is_synced_to_graph: Boolean!
    latest_block_at: String!
    peers_count: Int!
    pending_channels_count: Int!
    public_key: String!
    uris: [String!]!
    version: String!
  }

  type BalancesType {
    onchain: OnChainBalanceType!
    lightning: LightningBalanceType!
  }

  type OnChainBalanceType {
    confirmed: String!
    pending: String!
    closing: String!
  }

  type LightningBalanceType {
    confirmed: String!
    active: String!
    commit: String!
    pending: String!
  }
`;
