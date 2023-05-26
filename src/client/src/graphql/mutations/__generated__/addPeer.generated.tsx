import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddPeerMutationVariables = Types.Exact<{
  url?: Types.InputMaybe<Types.Scalars['String']['input']>;
  publicKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
  socket?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isTemporary?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export type AddPeerMutation = { __typename?: 'Mutation'; addPeer: boolean };

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
export type AddPeerMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    AddPeerMutation,
    AddPeerMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddPeerMutation, AddPeerMutationVariables>(
    AddPeerDocument,
    options
  );
}
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = Apollo.MutationResult<AddPeerMutation>;
export type AddPeerMutationOptions = Apollo.BaseMutationOptions<
  AddPeerMutation,
  AddPeerMutationVariables
>;
