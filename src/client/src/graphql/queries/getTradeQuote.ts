import { gql } from '@apollo/client';

export const GET_TRADE_QUOTE = gql`
  query GetTradeQuote($input: TradeQuoteInput!) {
    getTradeQuote(input: $input) {
      sats_amount
      asset_amount
      rate_fixed
      payment_request
      rfq_id
      expiry_epoch
    }
  }
`;
