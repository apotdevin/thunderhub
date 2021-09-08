/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateBoltzReverseSwapMutationVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
  address?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateBoltzReverseSwapMutation = { __typename?: 'Mutation', createBoltzReverseSwap: { __typename?: 'CreateBoltzReverseSwapType', id: string, invoice: string, redeemScript: string, onchainAmount: number, timeoutBlockHeight: number, lockupAddress: string, minerFeeInvoice?: Types.Maybe<string>, receivingAddress: string, preimage?: Types.Maybe<string>, preimageHash?: Types.Maybe<string>, privateKey?: Types.Maybe<string>, publicKey?: Types.Maybe<string>, decodedInvoice?: Types.Maybe<{ __typename?: 'decodeType', description: string, destination: string, expires_at: string, id: string, safe_tokens: number, tokens: number, destination_node: { __typename?: 'Node', node: { __typename?: 'nodeType', alias: string } } }> } };


export const CreateBoltzReverseSwapDocument = gql`
    mutation CreateBoltzReverseSwap($amount: Int!, $address: String) {
  createBoltzReverseSwap(amount: $amount, address: $address) {
    id
    invoice
    redeemScript
    onchainAmount
    timeoutBlockHeight
    lockupAddress
    minerFeeInvoice
    receivingAddress
    preimage
    preimageHash
    privateKey
    publicKey
    decodedInvoice {
      description
      destination
      expires_at
      id
      safe_tokens
      tokens
      destination_node {
        node {
          alias
        }
      }
    }
  }
}
    `;
export type CreateBoltzReverseSwapMutationFn = Apollo.MutationFunction<CreateBoltzReverseSwapMutation, CreateBoltzReverseSwapMutationVariables>;

/**
 * __useCreateBoltzReverseSwapMutation__
 *
 * To run a mutation, you first call `useCreateBoltzReverseSwapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBoltzReverseSwapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBoltzReverseSwapMutation, { data, loading, error }] = useCreateBoltzReverseSwapMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCreateBoltzReverseSwapMutation(baseOptions?: Apollo.MutationHookOptions<CreateBoltzReverseSwapMutation, CreateBoltzReverseSwapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBoltzReverseSwapMutation, CreateBoltzReverseSwapMutationVariables>(CreateBoltzReverseSwapDocument, options);
      }
export type CreateBoltzReverseSwapMutationHookResult = ReturnType<typeof useCreateBoltzReverseSwapMutation>;
export type CreateBoltzReverseSwapMutationResult = Apollo.MutationResult<CreateBoltzReverseSwapMutation>;
export type CreateBoltzReverseSwapMutationOptions = Apollo.BaseMutationOptions<CreateBoltzReverseSwapMutation, CreateBoltzReverseSwapMutationVariables>;