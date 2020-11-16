/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetLnMarketsUserInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLnMarketsUserInfoQuery = (
  { __typename?: 'Query' }
  & { getLnMarketsUserInfo?: Types.Maybe<(
    { __typename?: 'LnMarketsUserInfo' }
    & Pick<Types.LnMarketsUserInfo, 'uid' | 'balance' | 'account_type' | 'username' | 'linkingpublickey' | 'last_ip'>
  )> }
);


export const GetLnMarketsUserInfoDocument = gql`
    query GetLnMarketsUserInfo {
  getLnMarketsUserInfo {
    uid
    balance
    account_type
    username
    linkingpublickey
    last_ip
  }
}
    `;

/**
 * __useGetLnMarketsUserInfoQuery__
 *
 * To run a query within a React component, call `useGetLnMarketsUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnMarketsUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnMarketsUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLnMarketsUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetLnMarketsUserInfoQuery, GetLnMarketsUserInfoQueryVariables>) {
        return Apollo.useQuery<GetLnMarketsUserInfoQuery, GetLnMarketsUserInfoQueryVariables>(GetLnMarketsUserInfoDocument, baseOptions);
      }
export function useGetLnMarketsUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLnMarketsUserInfoQuery, GetLnMarketsUserInfoQueryVariables>) {
          return Apollo.useLazyQuery<GetLnMarketsUserInfoQuery, GetLnMarketsUserInfoQueryVariables>(GetLnMarketsUserInfoDocument, baseOptions);
        }
export type GetLnMarketsUserInfoQueryHookResult = ReturnType<typeof useGetLnMarketsUserInfoQuery>;
export type GetLnMarketsUserInfoLazyQueryHookResult = ReturnType<typeof useGetLnMarketsUserInfoLazyQuery>;
export type GetLnMarketsUserInfoQueryResult = Apollo.QueryResult<GetLnMarketsUserInfoQuery, GetLnMarketsUserInfoQueryVariables>;