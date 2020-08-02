import { gql } from '@apollo/client';

export const UPDATE_FEES = gql`
  mutation UpdateFees(
    $transaction_id: String
    $transaction_vout: Int
    $base_fee_tokens: Float
    $fee_rate: Int
    $cltv_delta: Int
    $max_htlc_mtokens: String
    $min_htlc_mtokens: String
  ) {
    updateFees(
      transaction_id: $transaction_id
      transaction_vout: $transaction_vout
      base_fee_tokens: $base_fee_tokens
      fee_rate: $fee_rate
      cltv_delta: $cltv_delta
      max_htlc_mtokens: $max_htlc_mtokens
      min_htlc_mtokens: $min_htlc_mtokens
    )
  }
`;
