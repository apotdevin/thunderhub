import { gql } from '@apollo/client';

export const CLAIM_BOLTZ_TRANSACTION = gql`
  mutation ClaimBoltzTransaction(
    $id: String!
    $redeem: String!
    $transaction: String!
    $preimage: String!
    $privateKey: String!
    $destination: String!
    $fee: Float!
  ) {
    claimBoltzTransaction(
      id: $id
      redeem: $redeem
      transaction: $transaction
      preimage: $preimage
      privateKey: $privateKey
      destination: $destination
      fee: $fee
    )
  }
`;
