import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type RemovePeerMutationVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;

export type RemovePeerMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'removePeer'
>;

export const RemovePeerDocument = gql`
  mutation RemovePeer($publicKey: String!) {
    removePeer(publicKey: $publicKey)
  }
`;
export type RemovePeerMutationFn = ApolloReactCommon.MutationFunction<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;

/**
 * __useRemovePeerMutation__
 *
 * To run a mutation, you first call `useRemovePeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePeerMutation, { data, loading, error }] = useRemovePeerMutation({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useRemovePeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >(RemovePeerDocument, baseOptions);
}
export type RemovePeerMutationHookResult = ReturnType<
  typeof useRemovePeerMutation
>;
export type RemovePeerMutationResult = ApolloReactCommon.MutationResult<
  RemovePeerMutation
>;
export type RemovePeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;
