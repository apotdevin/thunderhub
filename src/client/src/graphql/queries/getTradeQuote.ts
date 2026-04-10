import { gql } from '@apollo/client';

export const GET_TRADE_QUOTE = gql`
  query GetTradeQuote($input: TradeQuoteInput!) {
    getTradeQuote(input: $input) {
      satsAmount
      assetAmount
      rateFixed
      paymentRequest
      rfqId
      expiryEpoch
    }
  }
`;
