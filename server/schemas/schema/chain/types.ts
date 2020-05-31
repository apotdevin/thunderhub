import { gql } from 'apollo-server-micro';

export const chainTypes = gql`
  type getUtxosType {
    address: String
    address_format: String
    confirmation_count: Int
    output_script: String
    tokens: Int
    transaction_id: String
    transaction_vout: Int
  }
  type sendToType {
    confirmationCount: String
    id: String
    isConfirmed: Boolean
    isOutgoing: Boolean
    tokens: Int
  }
`;
