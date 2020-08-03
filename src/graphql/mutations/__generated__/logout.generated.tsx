import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type LogoutMutationVariables = Types.Exact<{
  type: Types.Scalars['String'];
}>;

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'logout'
>;

export const LogoutDocument = gql`
  mutation Logout($type: String!) {
    logout(type: $type)
  }
`;
export type LogoutMutationFn = MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: MutationHookOptions<LogoutMutation, LogoutMutationVariables>
) {
  return useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = MutationResult<LogoutMutation>;
export type LogoutMutationOptions = BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
