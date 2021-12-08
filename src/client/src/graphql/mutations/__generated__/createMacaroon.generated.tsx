import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type CreateMacaroonMutationVariables = Types.Exact<{
  permissions: Types.NetworkInfoInput;
}>;

export type CreateMacaroonMutation = {
  __typename?: 'Mutation';
  createMacaroon: { __typename?: 'CreateMacaroon'; base: string; hex: string };
};

export const CreateMacaroonDocument = gql`
  mutation CreateMacaroon($permissions: NetworkInfoInput!) {
    createMacaroon(permissions: $permissions) {
      base
      hex
    }
  }
`;
export type CreateMacaroonMutationFn = Apollo.MutationFunction<
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
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useCreateMacaroonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMacaroonMutation,
    CreateMacaroonMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMacaroonMutation,
    CreateMacaroonMutationVariables
  >(CreateMacaroonDocument, options);
}
export type CreateMacaroonMutationHookResult = ReturnType<
  typeof useCreateMacaroonMutation
>;
export type CreateMacaroonMutationResult =
  Apollo.MutationResult<CreateMacaroonMutation>;
export type CreateMacaroonMutationOptions = Apollo.BaseMutationOptions<
  CreateMacaroonMutation,
  CreateMacaroonMutationVariables
>;
