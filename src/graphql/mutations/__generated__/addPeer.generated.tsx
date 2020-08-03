import {
  gql,
  MutationFunction,
  useMutation,
  MutationHookOptions,
  BaseMutationOptions,
  MutationResult,
} from '@apollo/client';
import * as Types from '../../types';

export type AddPeerMutationVariables = Types.Exact<{
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
    $url: String
    $publicKey: String
    $socket: String
    $isTemporary: Boolean
  ) {
    addPeer(
      url: $url
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
export type AddPeerMutationFn = MutationFunction<
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
 *      url: // value for 'url'
 *      publicKey: // value for 'publicKey'
 *      socket: // value for 'socket'
 *      isTemporary: // value for 'isTemporary'
 *   },
 * });
 */
export function useAddPeerMutation(
  baseOptions?: MutationHookOptions<AddPeerMutation, AddPeerMutationVariables>
) {
  return useMutation<AddPeerMutation, AddPeerMutationVariables>(
    AddPeerDocument,
    baseOptions
  );
}
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = MutationResult<AddPeerMutation>;
export type AddPeerMutationOptions = BaseMutationOptions<
  AddPeerMutation,
  AddPeerMutationVariables
>;
