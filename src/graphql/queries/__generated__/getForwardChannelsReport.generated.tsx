import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetForwardChannelsReportQueryVariables = Types.Exact<{
  time?: Types.Maybe<Types.Scalars['String']>;
  order?: Types.Maybe<Types.Scalars['String']>;
  type?: Types.Maybe<Types.Scalars['String']>;
  auth: Types.AuthType;
}>;

export type GetForwardChannelsReportQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getForwardChannelsReport'
>;

export const GetForwardChannelsReportDocument = gql`
  query GetForwardChannelsReport(
    $time: String
    $order: String
    $type: String
    $auth: authType!
  ) {
    getForwardChannelsReport(
      time: $time
      order: $order
      auth: $auth
      type: $type
    )
  }
`;

/**
 * __useGetForwardChannelsReportQuery__
 *
 * To run a query within a React component, call `useGetForwardChannelsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardChannelsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardChannelsReportQuery({
 *   variables: {
 *      time: // value for 'time'
 *      order: // value for 'order'
 *      type: // value for 'type'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetForwardChannelsReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >(GetForwardChannelsReportDocument, baseOptions);
}
export function useGetForwardChannelsReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >(GetForwardChannelsReportDocument, baseOptions);
}
export type GetForwardChannelsReportQueryHookResult = ReturnType<
  typeof useGetForwardChannelsReportQuery
>;
export type GetForwardChannelsReportLazyQueryHookResult = ReturnType<
  typeof useGetForwardChannelsReportLazyQuery
>;
export type GetForwardChannelsReportQueryResult = ApolloReactCommon.QueryResult<
  GetForwardChannelsReportQuery,
  GetForwardChannelsReportQueryVariables
>;
