import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type RemoveTwofaSecretMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;

export type RemoveTwofaSecretMutation = {
  __typename?: 'Mutation';
  removeTwofaSecret: boolean;
};

export const RemoveTwofaSecretDocument = gql`
  mutation RemoveTwofaSecret($token: String!) {
    removeTwofaSecret(token: $token)
  }
`;
export type RemoveTwofaSecretMutationFn = Apollo.MutationFunction<
  RemoveTwofaSecretMutation,
  RemoveTwofaSecretMutationVariables
>;

/**
 * __useRemoveTwofaSecretMutation__
 *
 * To run a mutation, you first call `useRemoveTwofaSecretMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTwofaSecretMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTwofaSecretMutation, { data, loading, error }] = useRemoveTwofaSecretMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRemoveTwofaSecretMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveTwofaSecretMutation,
    RemoveTwofaSecretMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveTwofaSecretMutation,
    RemoveTwofaSecretMutationVariables
  >(RemoveTwofaSecretDocument, options);
}
export type RemoveTwofaSecretMutationHookResult = ReturnType<
  typeof useRemoveTwofaSecretMutation
>;
export type RemoveTwofaSecretMutationResult =
  Apollo.MutationResult<RemoveTwofaSecretMutation>;
export type RemoveTwofaSecretMutationOptions = Apollo.BaseMutationOptions<
  RemoveTwofaSecretMutation,
  RemoveTwofaSecretMutationVariables
>;
