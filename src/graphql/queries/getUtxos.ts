import { gql } from '@apollo/client';

export const GET_UTXOS = gql`
  query GetUtxos {
    getUtxos {
      address
      address_format
      confirmation_count
      output_script
      tokens
      transaction_id
      transaction_vout
    }
  }
`;
