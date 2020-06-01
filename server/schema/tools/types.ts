import { gql } from 'apollo-server-micro';

export const toolsTypes = gql`
  type decodeType {
    chain_address: String
    cltv_delta: Int
    description: String
    description_hash: String
    destination: String
    expires_at: String
    id: String
    mtokens: String
    routes: [DecodeRoutesType]
    safe_tokens: Int
    tokens: Int
  }

  type DecodeRoutesType {
    base_fee_mtokens: String
    channel: String
    cltv_delta: Int
    fee_rate: Int
    public_key: String
  }
`;
