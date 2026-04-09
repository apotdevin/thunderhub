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
    amountSats?: string | null;
    feeSats?: string | null;
  };
};

export const ExecuteTradeDocument = gql`
  mutation ExecuteTrade($input: ExecuteTradeInput!) {
    executeTrade(input: $input) {
      success
      paymentPreimage
      amountSats
      feeSats
    }
  }
`;
export type ExecuteTradeMutationFn = Apollo.MutationFunction<
  ExecuteTradeMutation,
  ExecuteTradeMutationVariables
>;

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
