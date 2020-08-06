import { gql } from '@apollo/client';

export const GET_LN_PAY = gql`
  query GetLnPay($amount: Int!) {
    getLnPay(amount: $amount)
  }
`;
