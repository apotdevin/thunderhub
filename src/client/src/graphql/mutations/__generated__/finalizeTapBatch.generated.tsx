import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type FinalizeTapBatchMutationVariables = { [key: string]: never };

export type FinalizeTapBatchMutation = {
  __typename?: 'Mutation';
  finalizeTapBatch: {
    __typename?: 'TapFinalizeBatchResponse';
    batchKey?: string | null;
  };
};

export const FinalizeTapBatchDocument = gql`
  mutation FinalizeTapBatch {
    finalizeTapBatch {
      batchKey
    }
  }
`;

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
