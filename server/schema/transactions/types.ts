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
    mtokens: String
    outgoing_channel: String
    tokens: Int
    incoming_channel_info: Channel
    outgoing_channel_info: Channel
  }

  type getResumeType {
    token: String
    resume: String
  }
`;
