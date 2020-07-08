import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type AddPeerMutationVariables = Types.Exact<{
  auth: Types.AuthType;
  url?: Types.Maybe<Types.Scalars['String']>;
  publicKey?: Types.Maybe<Types.Scalars['String']>;
  socket?: Types.Maybe<Types.Scalars['String']>;
  isTemporary?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type AddPeerMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'addPeer'
>;

export const AddPeerDocument = gql`
  mutation AddPeer(
    $auth: authType!
    $url: String
    $publicKey: String
    $socket: String
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      url: $url
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
export type AddPeerMutationFn = ApolloReactCommon.MutationFunction<
  AddPeerMutation,
  AddPeerMutationVariables
>;

/**
 * __useAddPeerMutation__
 *
 * To run a mutation, you first call `useAddPeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPeerMutation, { data, loading, error }] = useAddPeerMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      url: // value for 'url'
 *      publicKey: // value for 'publicKey'
 *      socket: // value for 'socket'
 *      isTemporary: // value for 'isTemporary'
 *   },
 * });
 */
export function useAddPeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddPeerMutation,
    AddPeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddPeerMutation,
    AddPeerMutationVariables
  >(AddPeerDocument, baseOptions);
}
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = ApolloReactCommon.MutationResult<
  AddPeerMutation
>;
export type AddPeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddPeerMutation,
  AddPeerMutationVariables
>;
