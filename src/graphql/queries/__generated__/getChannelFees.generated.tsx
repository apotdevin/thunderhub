import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type ChannelFeesQueryVariables = {
  auth: Types.AuthType;
};

export type ChannelFeesQuery = { __typename?: 'Query' } & {
  getChannelFees?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'channelFeeType' } & Pick<
          Types.ChannelFeeType,
          | 'alias'
          | 'color'
          | 'baseFee'
          | 'feeRate'
          | 'transactionId'
          | 'transactionVout'
          | 'public_key'
        >
      >
    >
  >;
};

export const ChannelFeesDocument = gql`
  query ChannelFees($auth: authType!) {
    getChannelFees(auth: $auth) {
      alias
      color
      baseFee
      feeRate
      transactionId
      transactionVout
      public_key
    }
  }
`;

/**
 * __useChannelFeesQuery__
 *
 * To run a query within a React component, call `useChannelFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelFeesQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useChannelFeesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ChannelFeesQuery, ChannelFeesQueryVariables>(
    ChannelFeesDocument,
    baseOptions
  );
}
export function useChannelFeesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >(ChannelFeesDocument, baseOptions);
}
export type ChannelFeesQueryHookResult = ReturnType<typeof useChannelFeesQuery>;
export type ChannelFeesLazyQueryHookResult = ReturnType<
  typeof useChannelFeesLazyQuery
>;
export type ChannelFeesQueryResult = ApolloReactCommon.QueryResult<
  ChannelFeesQuery,
  ChannelFeesQueryVariables
>;
