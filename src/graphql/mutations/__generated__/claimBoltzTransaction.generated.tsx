/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ClaimBoltzTransactionMutationVariables = Types.Exact<{
  redeem: Types.Scalars['String'];
  transaction: Types.Scalars['String'];
  preimage: Types.Scalars['String'];
  privateKey: Types.Scalars['String'];
  destination: Types.Scalars['String'];
  fee: Types.Scalars['Int'];
}>;


export type ClaimBoltzTransactionMutation = { __typename?: 'Mutation', claimBoltzTransaction: string };


export const ClaimBoltzTransactionDocument = gql`
    mutation ClaimBoltzTransaction($redeem: String!, $transaction: String!, $preimage: String!, $privateKey: String!, $destination: String!, $fee: Int!) {
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
export type ClaimBoltzTransactionMutationFn = Apollo.MutationFunction<ClaimBoltzTransactionMutation, ClaimBoltzTransactionMutationVariables>;

/**
 * __useClaimBoltzTransactionMutation__
 *
 * To run a mutation, you first call `useClaimBoltzTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimBoltzTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimBoltzTransactionMutation, { data, loading, error }] = useClaimBoltzTransactionMutation({
 *   variables: {
 *      redeem: // value for 'redeem'
 *      transaction: // value for 'transaction'
 *      preimage: // value for 'preimage'
 *      privateKey: // value for 'privateKey'
 *      destination: // value for 'destination'
 *      fee: // value for 'fee'
 *   },
 * });
 */
export function useClaimBoltzTransactionMutation(baseOptions?: Apollo.MutationHookOptions<ClaimBoltzTransactionMutation, ClaimBoltzTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClaimBoltzTransactionMutation, ClaimBoltzTransactionMutationVariables>(ClaimBoltzTransactionDocument, options);
      }
export type ClaimBoltzTransactionMutationHookResult = ReturnType<typeof useClaimBoltzTransactionMutation>;
export type ClaimBoltzTransactionMutationResult = Apollo.MutationResult<ClaimBoltzTransactionMutation>;
export type ClaimBoltzTransactionMutationOptions = Apollo.BaseMutationOptions<ClaimBoltzTransactionMutation, ClaimBoltzTransactionMutationVariables>;