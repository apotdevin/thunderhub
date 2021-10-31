/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AddPeerMutationVariables = Types.Exact<{
  url?: Types.Maybe<Types.Scalars['String']>;
  publicKey?: Types.Maybe<Types.Scalars['String']>;
  socket?: Types.Maybe<Types.Scalars['String']>;
  isTemporary?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type AddPeerMutation = { __typename?: 'Mutation', addPeer?: boolean | null | undefined };


export const AddPeerDocument = gql`
    mutation AddPeer($url: String, $publicKey: String, $socket: String, $isTemporary: Boolean) {
  addPeer(
    url: $url
    publicKey: $publicKey
    socket: $socket
    isTemporary: $isTemporary
  )
}
    `;
export type AddPeerMutationFn = Apollo.MutationFunction<AddPeerMutation, AddPeerMutationVariables>;

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
export function useAddPeerMutation(baseOptions?: Apollo.MutationHookOptions<AddPeerMutation, AddPeerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPeerMutation, AddPeerMutationVariables>(AddPeerDocument, options);
      }
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = Apollo.MutationResult<AddPeerMutation>;
export type AddPeerMutationOptions = Apollo.BaseMutationOptions<AddPeerMutation, AddPeerMutationVariables>;