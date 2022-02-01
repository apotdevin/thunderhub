import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleAutoBackupsMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ToggleAutoBackupsMutation = {
  __typename?: 'Mutation';
  toggleAutoBackups: boolean;
};

export const ToggleAutoBackupsDocument = gql`
  mutation ToggleAutoBackups {
    toggleAutoBackups
  }
`;
export type ToggleAutoBackupsMutationFn = Apollo.MutationFunction<
  ToggleAutoBackupsMutation,
  ToggleAutoBackupsMutationVariables
>;

/**
 * __useToggleAutoBackupsMutation__
 *
 * To run a mutation, you first call `useToggleAutoBackupsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleAutoBackupsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleAutoBackupsMutation, { data, loading, error }] = useToggleAutoBackupsMutation({
 *   variables: {
 *   },
 * });
 */
export function useToggleAutoBackupsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ToggleAutoBackupsMutation,
    ToggleAutoBackupsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ToggleAutoBackupsMutation,
    ToggleAutoBackupsMutationVariables
  >(ToggleAutoBackupsDocument, options);
}
export type ToggleAutoBackupsMutationHookResult = ReturnType<
  typeof useToggleAutoBackupsMutation
>;
export type ToggleAutoBackupsMutationResult =
  Apollo.MutationResult<ToggleAutoBackupsMutation>;
export type ToggleAutoBackupsMutationOptions = Apollo.BaseMutationOptions<
  ToggleAutoBackupsMutation,
  ToggleAutoBackupsMutationVariables
>;
