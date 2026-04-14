import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LogoutAmbossMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LogoutAmbossMutation = {
  __typename?: 'Mutation';
  logoutAmboss: boolean;
};

export const LogoutAmbossDocument = gql`
  mutation LogoutAmboss {
    logoutAmboss
  }
`;
export type LogoutAmbossMutationFn = Apollo.MutationFunction<
  LogoutAmbossMutation,
  LogoutAmbossMutationVariables
>;

/**
 * __useLogoutAmbossMutation__
 *
 * To run a mutation, you first call `useLogoutAmbossMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutAmbossMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutAmbossMutation, { data, loading, error }] = useLogoutAmbossMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutAmbossMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutAmbossMutation,
    LogoutAmbossMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LogoutAmbossMutation,
    LogoutAmbossMutationVariables
  >(LogoutAmbossDocument, options);
}
export type LogoutAmbossMutationHookResult = ReturnType<
  typeof useLogoutAmbossMutation
>;
export type LogoutAmbossMutationResult =
  Apollo.MutationResult<LogoutAmbossMutation>;
export type LogoutAmbossMutationOptions = Apollo.BaseMutationOptions<
  LogoutAmbossMutation,
  LogoutAmbossMutationVariables
>;
