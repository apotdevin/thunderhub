import { gql } from 'apollo-server-micro';

export const transactionTypes = gql`
  type Forward {
    created_at: String!
    fee: Int!
    fee_mtokens: String!
    incoming_channel: String!
    mtokens: String!
    outgoing_channel: String!
    tokens: Int!
  }

  type ForwardNodeType {
    alias: String
    capacity: String
    channel_count: Int
    color: String
    updated_at: String
    channel_id: String
    public_key: String
  }

  type PaymentType {
    created_at: String!
    destination: String!
    destination_node: Node
    fee: Int!
    fee_mtokens: String!
    hops: [Node!]!
    id: String!
    index: Int
    is_confirmed: Boolean!
    is_outgoing: Boolean!
    mtokens: String!
    request: String
    safe_fee: Int!
    safe_tokens: Int
    secret: String!
    tokens: String!
    type: String!
    date: String!
  }

  type InvoiceType {
    chain_address: String
    confirmed_at: String
    created_at: String!
    description: String!
    description_hash: String
    expires_at: String!
    id: String!
    is_canceled: Boolean
    is_confirmed: Boolean!
    is_held: Boolean
    is_private: Boolean!
    is_push: Boolean
    received: Int!
    received_mtokens: String!
    request: String
    secret: String!
    tokens: String!
    type: String!
    date: String!
  }

  union Transaction = InvoiceType | PaymentType

  type getResumeType {
    token: String
    resume: [Transaction]
  }
`;
