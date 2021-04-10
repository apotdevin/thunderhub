import { gql } from '@apollo/client';

export const GET_RESUME = gql`
  query GetResume($offset: Int, $limit: Int) {
    getResume(offset: $offset, limit: $limit) {
      offset
      resume {
        ... on InvoiceType {
          chain_address
          confirmed_at
          created_at
          description
          description_hash
          expires_at
          id
          is_canceled
          is_confirmed
          is_held
          is_private
          is_push
          received
          received_mtokens
          request
          secret
          tokens
          type
          date
          payments {
            in_channel
            messages {
              message
            }
          }
        }
        ... on PaymentType {
          created_at
          destination
          destination_node {
            node {
              alias
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
  }
`;
