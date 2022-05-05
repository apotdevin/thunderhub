import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PushBackupMutationVariables = Types.Exact<{ [key: string]: never }>;

export type PushBackupMutation = {
  __typename?: 'Mutation';
  pushBackup: boolean;
};

export const PushBackupDocument = gql`
  mutation PushBackup {
    pushBackup
  }
`;
export type PushBackupMutationFn = Apollo.MutationFunction<
  PushBackupMutation,
  PushBackupMutationVariables
>;

/**
 * __usePushBackupMutation__
 *
 * To run a mutation, you first call `usePushBackupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePushBackupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pushBackupMutation, { data, loading, error }] = usePushBackupMutation({
 *   variables: {
 *   },
 * });
 */
export function usePushBackupMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PushBackupMutation,
    PushBackupMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PushBackupMutation, PushBackupMutationVariables>(
    PushBackupDocument,
    options
  );
}
export type PushBackupMutationHookResult = ReturnType<
  typeof usePushBackupMutation
>;
export type PushBackupMutationResult =
  Apollo.MutationResult<PushBackupMutation>;
export type PushBackupMutationOptions = Apollo.BaseMutationOptions<
  PushBackupMutation,
  PushBackupMutationVariables
>;
