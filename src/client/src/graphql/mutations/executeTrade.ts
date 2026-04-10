import { gql } from '@apollo/client';

export const EXECUTE_TRADE = gql`
  mutation ExecuteTrade($input: ExecuteTradeInput!) {
    executeTrade(input: $input) {
      success
      paymentPreimage
      satsAmount
      feeSats
    }
  }
`;
