import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPeerChannelsQueryVariables = Types.Exact<{
  partner_public_key: Types.Scalars['String']['input'];
}>;

export type GetPeerChannelsQuery = {
  __typename?: 'Query';
  getChannels: Array<{
    __typename?: 'Channel';
    id: string;
    capacity: number;
    local_balance: number;
    remote_balance: number;
    is_active: boolean;
    partner_public_key: string;
    transaction_id: string;
    transaction_vout: number;
  }>;
};

export const GetPeerChannelsDocument = gql`
  query GetPeerChannels($partner_public_key: String!) {
    getChannels(partner_public_key: $partner_public_key) {
      id
      capacity
      local_balance
      remote_balance
      is_active
      partner_public_key
      transaction_id
      transaction_vout
    }
  }
`;

/**
 * __useGetPeerChannelsQuery__
 *
 * To run a query within a React component, call `useGetPeerChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeerChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeerChannelsQuery({
 *   variables: {
 *      partner_public_key: // value for 'partner_public_key'
 *   },
 * });
 */
export function useGetPeerChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPeerChannelsQuery,
    GetPeerChannelsQueryVariables
  > &
    (
      | { variables: GetPeerChannelsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPeerChannelsQuery, GetPeerChannelsQueryVariables>(
    GetPeerChannelsDocument,
    options
  );
}
export function useGetPeerChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPeerChannelsQuery,
    GetPeerChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPeerChannelsQuery,
    GetPeerChannelsQueryVariables
  >(GetPeerChannelsDocument, options);
}
// @ts-ignore
export function useGetPeerChannelsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetPeerChannelsQuery,
    GetPeerChannelsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetPeerChannelsQuery,
  GetPeerChannelsQueryVariables
>;
export function useGetPeerChannelsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPeerChannelsQuery,
        GetPeerChannelsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetPeerChannelsQuery | undefined,
  GetPeerChannelsQueryVariables
>;
export function useGetPeerChannelsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPeerChannelsQuery,
        GetPeerChannelsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetPeerChannelsQuery,
    GetPeerChannelsQueryVariables
  >(GetPeerChannelsDocument, options);
}
export type GetPeerChannelsQueryHookResult = ReturnType<
  typeof useGetPeerChannelsQuery
>;
export type GetPeerChannelsLazyQueryHookResult = ReturnType<
  typeof useGetPeerChannelsLazyQuery
>;
export type GetPeerChannelsSuspenseQueryHookResult = ReturnType<
  typeof useGetPeerChannelsSuspenseQuery
>;
export type GetPeerChannelsQueryResult = Apollo.QueryResult<
  GetPeerChannelsQuery,
  GetPeerChannelsQueryVariables
>;
