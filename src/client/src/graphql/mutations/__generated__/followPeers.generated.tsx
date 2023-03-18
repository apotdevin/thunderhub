import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FollowPeersMutationVariables = Types.Exact<{
  privateKey: Types.Scalars['String'];
}>;

export type FollowPeersMutation = {
  __typename?: 'Mutation';
  followPeers?: {
    __typename?: 'FollowPeers';
    peers: {
      __typename?: 'NostrEvent';
      kind: number;
      id: string;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      sig: string;
    };
  } | null;
};

export const FollowPeersDocument = gql`
  mutation FollowPeers($privateKey: String!) {
    followPeers(privateKey: $privateKey) {
      peers {
        kind
        id
        tags
        content
        created_at
        pubkey
        sig
      }
    }
  }
`;
export type FollowPeersMutationFn = Apollo.MutationFunction<
  FollowPeersMutation,
  FollowPeersMutationVariables
>;

/**
 * __useFollowPeersMutation__
 *
 * To run a mutation, you first call `useFollowPeersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowPeersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followPeersMutation, { data, loading, error }] = useFollowPeersMutation({
 *   variables: {
 *      privateKey: // value for 'privateKey'
 *   },
 * });
 */
export function useFollowPeersMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FollowPeersMutation,
    FollowPeersMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FollowPeersMutation, FollowPeersMutationVariables>(
    FollowPeersDocument,
    options
  );
}
export type FollowPeersMutationHookResult = ReturnType<
  typeof useFollowPeersMutation
>;
export type FollowPeersMutationResult =
  Apollo.MutationResult<FollowPeersMutation>;
export type FollowPeersMutationOptions = Apollo.BaseMutationOptions<
  FollowPeersMutation,
  FollowPeersMutationVariables
>;
