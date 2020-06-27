import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type CreateMacaroonMutationVariables = Types.Exact<{
  auth: Types.AuthType;
  permissions: Types.PermissionsType;
}>;

export type CreateMacaroonMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'createMacaroon'
>;

export const CreateMacaroonDocument = gql`
  mutation CreateMacaroon($auth: authType!, $permissions: permissionsType!) {
    createMacaroon(auth: $auth, permissions: $permissions)
  }
`;
export type CreateMacaroonMutationFn = ApolloReactCommon.MutationFunction<
  CreateMacaroonMutation,
  CreateMacaroonMutationVariables
>;

/**
 * __useCreateMacaroonMutation__
 *
 * To run a mutation, you first call `useCreateMacaroonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMacaroonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMacaroonMutation, { data, loading, error }] = useCreateMacaroonMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useCreateMacaroonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateMacaroonMutation,
    CreateMacaroonMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateMacaroonMutation,
    CreateMacaroonMutationVariables
  >(CreateMacaroonDocument, baseOptions);
}
export type CreateMacaroonMutationHookResult = ReturnType<
  typeof useCreateMacaroonMutation
>;
export type CreateMacaroonMutationResult = ApolloReactCommon.MutationResult<
  CreateMacaroonMutation
>;
export type CreateMacaroonMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateMacaroonMutation,
  CreateMacaroonMutationVariables
>;
