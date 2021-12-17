import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type UpdateTwofaSecretMutationVariables = Types.Exact<{
  secret: Types.Scalars['String'];
  token: Types.Scalars['String'];
}>;

export type UpdateTwofaSecretMutation = {
  __typename?: 'Mutation';
  updateTwofaSecret: boolean;
};

export const UpdateTwofaSecretDocument = gql`
  mutation UpdateTwofaSecret($secret: String!, $token: String!) {
    updateTwofaSecret(secret: $secret, token: $token)
  }
`;
export type UpdateTwofaSecretMutationFn = Apollo.MutationFunction<
  UpdateTwofaSecretMutation,
  UpdateTwofaSecretMutationVariables
>;

/**
 * __useUpdateTwofaSecretMutation__
 *
 * To run a mutation, you first call `useUpdateTwofaSecretMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTwofaSecretMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTwofaSecretMutation, { data, loading, error }] = useUpdateTwofaSecretMutation({
 *   variables: {
 *      secret: // value for 'secret'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUpdateTwofaSecretMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTwofaSecretMutation,
    UpdateTwofaSecretMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateTwofaSecretMutation,
    UpdateTwofaSecretMutationVariables
  >(UpdateTwofaSecretDocument, options);
}
export type UpdateTwofaSecretMutationHookResult = ReturnType<
  typeof useUpdateTwofaSecretMutation
>;
export type UpdateTwofaSecretMutationResult =
  Apollo.MutationResult<UpdateTwofaSecretMutation>;
export type UpdateTwofaSecretMutationOptions = Apollo.BaseMutationOptions<
  UpdateTwofaSecretMutation,
  UpdateTwofaSecretMutationVariables
>;
