import { gql } from 'apollo-server-micro';

export const peerTypes = gql`
  type peerType {
    bytes_received: Int!
    bytes_sent: Int!
    is_inbound: Boolean!
    is_sync_peer: Boolean
    ping_time: Int!
    public_key: String!
    socket: String!
    tokens_received: Int!
    tokens_sent: Int!
    partner_node_info: Node!
  }
`;
