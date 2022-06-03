import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPeerSwapPeersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetPeerSwapPeersQuery = {
  __typename?: 'Query';
  getPeerSwapPeers: {
    __typename?: 'GetPeerSwapPeersType';
    peers: Array<{
      __typename?: 'PeerSwapPeerType';
      supportedAssets: Array<string>;
      nodeId: string;
      swapsAllowed: boolean;
      paidFee: string;
      channels: Array<{
        __typename?: 'PeerSwapChannelType';
        channelId: string;
        localBalance: string;
        remoteBalance: string;
        localPercentage: string;
        active: boolean;
      }>;
      asSender: {
        __typename?: 'PeerSwapStatsType';
        swapsOut: string;
        swapsIn: string;
        satsOut: string;
        satsIn: string;
      };
      asReceiver: {
        __typename?: 'PeerSwapStatsType';
        swapsOut: string;
        swapsIn: string;
        satsOut: string;
        satsIn: string;
      };
    }>;
  };
};

export const GetPeerSwapPeersDocument = gql`
  query GetPeerSwapPeers {
    getPeerSwapPeers {
      peers {
        supportedAssets
        channels {
          channelId
          localBalance
          remoteBalance
          localPercentage
          active
        }
        nodeId
        swapsAllowed
        asSender {
          swapsOut
          swapsIn
          satsOut
          satsIn
        }
        asReceiver {
          swapsOut
          swapsIn
          satsOut
          satsIn
        }
        paidFee
      }
    }
  }
`;

/**
 * __useGetPeerSwapPeersQuery__
 *
 * To run a query within a React component, call `useGetPeerSwapPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeerSwapPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeerSwapPeersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPeerSwapPeersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPeerSwapPeersQuery,
    GetPeerSwapPeersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPeerSwapPeersQuery, GetPeerSwapPeersQueryVariables>(
    GetPeerSwapPeersDocument,
    options
  );
}
export function useGetPeerSwapPeersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPeerSwapPeersQuery,
    GetPeerSwapPeersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPeerSwapPeersQuery,
    GetPeerSwapPeersQueryVariables
  >(GetPeerSwapPeersDocument, options);
}
export type GetPeerSwapPeersQueryHookResult = ReturnType<
  typeof useGetPeerSwapPeersQuery
>;
export type GetPeerSwapPeersLazyQueryHookResult = ReturnType<
  typeof useGetPeerSwapPeersLazyQuery
>;
export type GetPeerSwapPeersQueryResult = Apollo.QueryResult<
  GetPeerSwapPeersQuery,
  GetPeerSwapPeersQueryVariables
>;
