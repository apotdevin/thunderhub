import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleHealthPingsMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ToggleHealthPingsMutation = {
  __typename?: 'Mutation';
  toggleHealthPings: boolean;
};

export const ToggleHealthPingsDocument = gql`
  mutation ToggleHealthPings {
    toggleHealthPings
  }
`;
export type ToggleHealthPingsMutationFn = Apollo.MutationFunction<
  ToggleHealthPingsMutation,
  ToggleHealthPingsMutationVariables
>;

/**
 * __useToggleHealthPingsMutation__
 *
 * To run a mutation, you first call `useToggleHealthPingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleHealthPingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleHealthPingsMutation, { data, loading, error }] = useToggleHealthPingsMutation({
 *   variables: {
 *   },
 * });
 */
export function useToggleHealthPingsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ToggleHealthPingsMutation,
    ToggleHealthPingsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ToggleHealthPingsMutation,
    ToggleHealthPingsMutationVariables
  >(ToggleHealthPingsDocument, options);
}
export type ToggleHealthPingsMutationHookResult = ReturnType<
  typeof useToggleHealthPingsMutation
>;
export type ToggleHealthPingsMutationResult =
  Apollo.MutationResult<ToggleHealthPingsMutation>;
export type ToggleHealthPingsMutationOptions = Apollo.BaseMutationOptions<
  ToggleHealthPingsMutation,
  ToggleHealthPingsMutationVariables
>;
