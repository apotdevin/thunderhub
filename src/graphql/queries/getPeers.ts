import gql from 'graphql-tag';

export const GET_PEERS = gql`
  query GetPeers {
    getPeers {
      bytes_received
      bytes_sent
      is_inbound
      is_sync_peer
      ping_time
      public_key
      socket
      tokens_received
      tokens_sent
      partner_node_info {
        node {
          alias
          capacity
          channel_count
          color
          updated_at
        }
      }
    }
  }
`;
