import { gql } from '@apollo/client';

export const PurchaseLiquidity = gql`
  mutation PurchaseLiquidity($amount_cents: String!) {
    purchaseLiquidity(amount_cents: $amount_cents)
  }
`;
