import { gql } from '@apollo/client';

export const GET_NODE_INFO = gql`
  query GetNodeInfo {
    getNodeInfo {
      alias
      public_key
      uris
      chains
      color
      is_synced_to_chain
      peers_count
      version
      active_channels_count
      closed_channels_count
      pending_channels_count
    }
  }
`;
