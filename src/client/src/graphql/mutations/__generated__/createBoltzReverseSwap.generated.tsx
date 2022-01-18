import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateBoltzReverseSwapMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float'];
  address?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type CreateBoltzReverseSwapMutation = {
  __typename?: 'Mutation';
  createBoltzReverseSwap: {
    __typename?: 'CreateBoltzReverseSwapType';
    id: string;
    invoice: string;
    redeemScript: string;
    onchainAmount: number;
    timeoutBlockHeight: number;
    lockupAddress: string;
    minerFeeInvoice?: string | null | undefined;
    receivingAddress: string;
    preimage?: string | null | undefined;
    preimageHash?: string | null | undefined;
    privateKey?: string | null | undefined;
    publicKey?: string | null | undefined;
    decodedInvoice?:
      | {
          __typename?: 'DecodeInvoice';
          description: string;
          destination: string;
          expires_at: string;
          id: string;
          safe_tokens: number;
          tokens: number;
          destination_node?:
            | {
                __typename?: 'Node';
                node?:
                  | {
                      __typename?: 'NodeType';
                      alias: string;
                      public_key: string;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }
      | null
      | undefined;
  };
};

export const CreateBoltzReverseSwapDocument = gql`
  mutation CreateBoltzReverseSwap($amount: Float!, $address: String) {
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
            public_key
          }
        }
      }
    }
  }
`;
export type CreateBoltzReverseSwapMutationFn = Apollo.MutationFunction<
  CreateBoltzReverseSwapMutation,
  CreateBoltzReverseSwapMutationVariables
>;

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
export function useCreateBoltzReverseSwapMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateBoltzReverseSwapMutation,
    CreateBoltzReverseSwapMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateBoltzReverseSwapMutation,
    CreateBoltzReverseSwapMutationVariables
  >(CreateBoltzReverseSwapDocument, options);
}
export type CreateBoltzReverseSwapMutationHookResult = ReturnType<
  typeof useCreateBoltzReverseSwapMutation
>;
export type CreateBoltzReverseSwapMutationResult =
  Apollo.MutationResult<CreateBoltzReverseSwapMutation>;
export type CreateBoltzReverseSwapMutationOptions = Apollo.BaseMutationOptions<
  CreateBoltzReverseSwapMutation,
  CreateBoltzReverseSwapMutationVariables
>;
