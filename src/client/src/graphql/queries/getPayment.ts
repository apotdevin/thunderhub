import { gql } from '@apollo/client';

export const GET_PAYMENT = gql`
  query GetPayment($id: String!) {
    getPayment(id: $id) {
      created_at
      destination
      destination_node {
        node {
          alias
          public_key
        }
      }
      fee
      fee_mtokens
      hops {
        node {
          alias
          public_key
        }
      }
      id
      is_confirmed
      is_outgoing
      mtokens
      request
      safe_fee
      safe_tokens
      secret
      tokens
      type
      date
    }
  }
`;
