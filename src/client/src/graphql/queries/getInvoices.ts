import { gql } from '@apollo/client';

export const GET_INVOICES = gql`
  query GetInvoices($token: String) {
    getInvoices(token: $token) {
      next
      invoices {
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
    }
  }
`;
