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

  type getTransactionsType {
    block_id: String
    confirmation_count: Int
    confirmation_height: Int
    created_at: String
    fee: Int
    id: String
    output_addresses: [String]
    tokens: Int
  }
`;
