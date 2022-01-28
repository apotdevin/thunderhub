import { gql } from '@apollo/client';

export const GET_PAYMENTS = gql`
  query GetPayments($token: String) {
    getPayments(token: $token) {
      next
      payments {
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
        index
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
  }
`;
