import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FinalizeTapBatchMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type FinalizeTapBatchMutation = {
  __typename?: 'Mutation';
  finalizeTapBatch: {
    __typename?: 'TapFinalizeBatchResponse';
    batchKey: string;
  };
};

export const FinalizeTapBatchDocument = gql`
  mutation FinalizeTapBatch {
    finalizeTapBatch {
      batchKey
    }
  }
`;
export type FinalizeTapBatchMutationFn = Apollo.MutationFunction<
  FinalizeTapBatchMutation,
  FinalizeTapBatchMutationVariables
>;

/**
 * __useFinalizeTapBatchMutation__
 *
 * To run a mutation, you first call `useFinalizeTapBatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinalizeTapBatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finalizeTapBatchMutation, { data, loading, error }] = useFinalizeTapBatchMutation({
 *   variables: {
 *   },
 * });
 */
export function useFinalizeTapBatchMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FinalizeTapBatchMutation,
    FinalizeTapBatchMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    FinalizeTapBatchMutation,
    FinalizeTapBatchMutationVariables
  >(FinalizeTapBatchDocument, options);
}
export type FinalizeTapBatchMutationHookResult = ReturnType<
  typeof useFinalizeTapBatchMutation
>;
export type FinalizeTapBatchMutationResult =
  Apollo.MutationResult<FinalizeTapBatchMutation>;
export type FinalizeTapBatchMutationOptions = Apollo.BaseMutationOptions<
  FinalizeTapBatchMutation,
  FinalizeTapBatchMutationVariables
>;
