import gql from 'graphql-tag';

export const UPDATE_FEES = gql`
  mutation UpdateFees(
    $auth: authType!
    $transactionId: String
    $transactionVout: Int
    $baseFee: Float
    $feeRate: Int
  ) {
    updateFees(
      auth: $auth
      transactionId: $transactionId
      transactionVout: $transactionVout
      baseFee: $baseFee
      feeRate: $feeRate
    )
  }
`;
