import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ExecuteTradeMutationVariables = Types.Exact<{
  input: Types.ExecuteTradeInput;
}>;

export type ExecuteTradeMutation = {
  __typename?: 'Mutation';
  executeTrade: {
    __typename?: 'ExecuteTradeResult';
    success: boolean;
    paymentPreimage?: string | null;
    satsAmount?: string | null;
    feeSats?: string | null;
  };
};

export const ExecuteTradeDocument = gql`
  mutation ExecuteTrade($input: ExecuteTradeInput!) {
    executeTrade(input: $input) {
      success
      paymentPreimage
      satsAmount
      feeSats
    }
  }
`;
export type ExecuteTradeMutationFn = Apollo.MutationFunction<
  ExecuteTradeMutation,
  ExecuteTradeMutationVariables
>;

/**
 * __useExecuteTradeMutation__
 *
 * To run a mutation, you first call `useExecuteTradeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteTradeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeTradeMutation, { data, loading, error }] = useExecuteTradeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExecuteTradeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ExecuteTradeMutation,
    ExecuteTradeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ExecuteTradeMutation,
    ExecuteTradeMutationVariables
  >(ExecuteTradeDocument, options);
}
export type ExecuteTradeMutationHookResult = ReturnType<
  typeof useExecuteTradeMutation
>;
export type ExecuteTradeMutationResult =
  Apollo.MutationResult<ExecuteTradeMutation>;
export type ExecuteTradeMutationOptions = Apollo.BaseMutationOptions<
  ExecuteTradeMutation,
  ExecuteTradeMutationVariables
>;
