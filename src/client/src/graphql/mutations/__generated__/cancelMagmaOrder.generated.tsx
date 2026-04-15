import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CancelMagmaOrderMutationVariables = Types.Exact<{
  input: Types.CancelMagmaOrderInput;
}>;

export type CancelMagmaOrderMutation = {
  __typename?: 'Mutation';
  magma: {
    __typename?: 'MagmaMutations';
    cancel_order: { __typename?: 'CancelMagmaOrderResult'; success: boolean };
  };
};

export const CancelMagmaOrderDocument = gql`
  mutation CancelMagmaOrder($input: CancelMagmaOrderInput!) {
    magma {
      cancel_order(input: $input) {
        success
      }
    }
  }
`;
export type CancelMagmaOrderMutationFn = Apollo.MutationFunction<
  CancelMagmaOrderMutation,
  CancelMagmaOrderMutationVariables
>;

/**
 * __useCancelMagmaOrderMutation__
 *
 * To run a mutation, you first call `useCancelMagmaOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelMagmaOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelMagmaOrderMutation, { data, loading, error }] = useCancelMagmaOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelMagmaOrderMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelMagmaOrderMutation,
    CancelMagmaOrderMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CancelMagmaOrderMutation,
    CancelMagmaOrderMutationVariables
  >(CancelMagmaOrderDocument, options);
}
export type CancelMagmaOrderMutationHookResult = ReturnType<
  typeof useCancelMagmaOrderMutation
>;
export type CancelMagmaOrderMutationResult =
  Apollo.MutationResult<CancelMagmaOrderMutation>;
export type CancelMagmaOrderMutationOptions = Apollo.BaseMutationOptions<
  CancelMagmaOrderMutation,
  CancelMagmaOrderMutationVariables
>;
