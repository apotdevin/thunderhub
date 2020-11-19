import { gql } from '@apollo/client';

export const CLAIM_BOLTZ_TRANSACTION = gql`
  mutation ClaimBoltzTransaction(
    $redeem: String!
    $transaction: String!
    $preimage: String!
    $privateKey: String!
    $destination: String!
    $fee: Int!
  ) {
    claimBoltzTransaction(
      redeem: $redeem
      transaction: $transaction
      preimage: $preimage
      privateKey: $privateKey
      destination: $destination
      fee: $fee
    )
  }
`;
