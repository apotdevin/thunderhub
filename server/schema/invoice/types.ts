import { gql } from 'apollo-server-micro';

export const invoiceTypes = gql`
  type decodeType {
    chain_address: String
    cltv_delta: Int
    description: String!
    description_hash: String
    destination: String!
    expires_at: String!
    id: String!
    mtokens: String!
    payment: String
    routes: [[RouteType]]!
    safe_tokens: Int!
    tokens: Int!
    destination_node: Node!
    probe_route: ProbeRoute
  }

  type RouteType {
    base_fee_mtokens: String
    channel: String
    cltv_delta: Int
    fee_rate: Int
    public_key: String!
  }

  type payType {
    fee: Int
    fee_mtokens: String
    hops: [hopsType]
    id: String
    is_confirmed: Boolean
    is_outgoing: Boolean
    mtokens: String
    secret: String
    safe_fee: Int
    safe_tokens: Int
    tokens: Int
  }

  type hopsType {
    channel: String
    channel_capacity: Int
    fee_mtokens: String
    forward_mtokens: String
    timeout: Int
  }

  type newInvoiceType {
    chain_address: String
    created_at: DateTime
    description: String
    id: String
    request: String
    secret: String
    tokens: Int
  }
`;
