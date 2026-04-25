import { gql } from '@apollo/client';

export const EXECUTE_TRADE = gql`
  mutation ExecuteTrade($input: ExecuteTradeInput!) {
    executeTrade(input: $input) {
      success
      payment_preimage
      sats_amount
      fee_sats
    }
  }
`;
