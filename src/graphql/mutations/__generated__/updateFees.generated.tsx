/* eslint-disable */
import * as Types from '../../types';

import * as Apollo from '@apollo/client';
const gql = Apollo.gql;

export type UpdateFeesMutationVariables = Types.Exact<{
  transaction_id?: Types.Maybe<Types.Scalars['String']>;
  transaction_vout?: Types.Maybe<Types.Scalars['Int']>;
  base_fee_tokens?: Types.Maybe<Types.Scalars['Float']>;
  fee_rate?: Types.Maybe<Types.Scalars['Int']>;
  cltv_delta?: Types.Maybe<Types.Scalars['Int']>;
  max_htlc_mtokens?: Types.Maybe<Types.Scalars['String']>;
  min_htlc_mtokens?: Types.Maybe<Types.Scalars['String']>;
}>;


export type UpdateFeesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateFees'>
);


export const UpdateFeesDocument = gql`
    mutation UpdateFees($transaction_id: String, $transaction_vout: Int, $base_fee_tokens: Float, $fee_rate: Int, $cltv_delta: Int, $max_htlc_mtokens: String, $min_htlc_mtokens: String) {
  updateFees(transaction_id: $transaction_id, transaction_vout: $transaction_vout, base_fee_tokens: $base_fee_tokens, fee_rate: $fee_rate, cltv_delta: $cltv_delta, max_htlc_mtokens: $max_htlc_mtokens, min_htlc_mtokens: $min_htlc_mtokens)
}
    `;
export type UpdateFeesMutationFn = Apollo.MutationFunction<UpdateFeesMutation, UpdateFeesMutationVariables>;

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
export function useUpdateFeesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFeesMutation, UpdateFeesMutationVariables>) {
        return Apollo.useMutation<UpdateFeesMutation, UpdateFeesMutationVariables>(UpdateFeesDocument, baseOptions);
      }
export type UpdateFeesMutationHookResult = ReturnType<typeof useUpdateFeesMutation>;
export type UpdateFeesMutationResult = Apollo.MutationResult<UpdateFeesMutation>;
export type UpdateFeesMutationOptions = Apollo.BaseMutationOptions<UpdateFeesMutation, UpdateFeesMutationVariables>;
