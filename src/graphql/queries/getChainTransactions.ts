import gql from 'graphql-tag';

export const GET_CHAIN_TRANSACTIONS = gql`
  query GetChainTransactions($auth: authType!) {
    getChainTransactions(auth: $auth) {
      block_id
      confirmation_count
      confirmation_height
      created_at
      fee
      id
      output_addresses
      tokens
    }
  }
`;
