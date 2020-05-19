import gql from 'graphql-tag';

export const GET_UTXOS = gql`
  query GetUtxos($auth: authType!) {
    getUtxos(auth: $auth) {
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
