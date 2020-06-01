import { gql } from 'apollo-server-micro';

export const transactionTypes = gql`
  type getForwardType {
    token: String
    forwards: [forwardType]
  }

  type forwardType {
    created_at: String
    fee: Int
    fee_mtokens: String
    incoming_channel: String
    incoming_alias: String
    incoming_color: String
    mtokens: String
    outgoing_channel: String
    outgoing_alias: String
    outgoing_color: String
    tokens: Int
  }

  type getResumeType {
    token: String
    resume: String
  }
`;
