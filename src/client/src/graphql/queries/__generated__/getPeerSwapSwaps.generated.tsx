import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPeerSwapSwapsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetPeerSwapSwapsQuery = {
  __typename?: 'Query';
  getPeerSwapSwaps: {
    __typename?: 'GetPeerSwapSwapsType';
    swaps: Array<{
      __typename?: 'PeerSwapSwapType';
      id: string;
      createdAt: string;
      type: string;
      role: string;
      state: string;
      initiatorNodeId: string;
      peerNodeId: string;
      amount: string;
      channelId: string;
      openingTxId: string;
      claimTxId: string;
      cancelMessage: string;
    }>;
  };
};

export const GetPeerSwapSwapsDocument = gql`
  query GetPeerSwapSwaps {
    getPeerSwapSwaps {
      swaps {
        id
        createdAt
        type
        role
        state
        initiatorNodeId
        peerNodeId
        amount
        channelId
        openingTxId
        claimTxId
        cancelMessage
      }
    }
  }
`;

/**
 * __useGetPeerSwapSwapsQuery__
 *
 * To run a query within a React component, call `useGetPeerSwapSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeerSwapSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeerSwapSwapsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPeerSwapSwapsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPeerSwapSwapsQuery,
    GetPeerSwapSwapsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPeerSwapSwapsQuery, GetPeerSwapSwapsQueryVariables>(
    GetPeerSwapSwapsDocument,
    options
  );
}
export function useGetPeerSwapSwapsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPeerSwapSwapsQuery,
    GetPeerSwapSwapsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPeerSwapSwapsQuery,
    GetPeerSwapSwapsQueryVariables
  >(GetPeerSwapSwapsDocument, options);
}
export type GetPeerSwapSwapsQueryHookResult = ReturnType<
  typeof useGetPeerSwapSwapsQuery
>;
export type GetPeerSwapSwapsLazyQueryHookResult = ReturnType<
  typeof useGetPeerSwapSwapsLazyQuery
>;
export type GetPeerSwapSwapsQueryResult = Apollo.QueryResult<
  GetPeerSwapSwapsQuery,
  GetPeerSwapSwapsQueryVariables
>;
