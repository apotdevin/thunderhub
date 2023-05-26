import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateFeesMutationVariables = Types.Exact<{
  transaction_id?: Types.InputMaybe<Types.Scalars['String']['input']>;
  transaction_vout?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  base_fee_tokens?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  fee_rate?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  cltv_delta?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  max_htlc_mtokens?: Types.InputMaybe<Types.Scalars['String']['input']>;
  min_htlc_mtokens?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type UpdateFeesMutation = {
  __typename?: 'Mutation';
  updateFees: boolean;
};

export const UpdateFeesDocument = gql`
  mutation UpdateFees(
    $transaction_id: String
    $transaction_vout: Float
    $base_fee_tokens: Float
    $fee_rate: Float
    $cltv_delta: Float
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
export type UpdateFeesMutationFn = Apollo.MutationFunction<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;

/**
 * __useUpdateFeesMutation__
 *
 * To run a mutation, you first call `useUpdateFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeesMutation, { data, loading, error }] = useUpdateFeesMutation({
 *   variables: {
 *      transaction_id: // value for 'transaction_id'
 *      transaction_vout: // value for 'transaction_vout'
 *      base_fee_tokens: // value for 'base_fee_tokens'
 *      fee_rate: // value for 'fee_rate'
 *      cltv_delta: // value for 'cltv_delta'
 *      max_htlc_mtokens: // value for 'max_htlc_mtokens'
 *      min_htlc_mtokens: // value for 'min_htlc_mtokens'
 *   },
 * });
 */
export function useUpdateFeesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateFeesMutation, UpdateFeesMutationVariables>(
    UpdateFeesDocument,
    options
  );
}
export type UpdateFeesMutationHookResult = ReturnType<
  typeof useUpdateFeesMutation
>;
export type UpdateFeesMutationResult =
  Apollo.MutationResult<UpdateFeesMutation>;
export type UpdateFeesMutationOptions = Apollo.BaseMutationOptions<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;
