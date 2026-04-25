import { gql } from '@apollo/client';

export const GET_TRADE_INVOICES = gql`
  query GetTradeInvoices($token: String) {
    trade {
      trade_invoices(token: $token) {
        invoices {
          id
          direction
          group_key
          asset_id
          asset_amount
          asset_symbol
          asset_precision
          sats
          is_confirmed
          is_canceled
          created_at
          confirmed_at
        }
        next
      }
    }
  }
`;
