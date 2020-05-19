import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type DecodeRequestQueryVariables = {
  auth: Types.AuthType;
  request: Types.Scalars['String'];
};

export type DecodeRequestQuery = { __typename?: 'Query' } & {
  decodeRequest?: Types.Maybe<
    { __typename?: 'decodeType' } & Pick<
      Types.DecodeType,
      | 'chain_address'
      | 'cltv_delta'
      | 'description'
      | 'description_hash'
      | 'destination'
      | 'expires_at'
      | 'id'
      | 'tokens'
    > & {
        routes?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'DecodeRoutesType' } & Pick<
                Types.DecodeRoutesType,
                | 'base_fee_mtokens'
                | 'channel'
                | 'cltv_delta'
                | 'fee_rate'
                | 'public_key'
              >
            >
          >
        >;
      }
  >;
};

export const DecodeRequestDocument = gql`
  query DecodeRequest($auth: authType!, $request: String!) {
    decodeRequest(auth: $auth, request: $request) {
      chain_address
      cltv_delta
      description
      description_hash
      destination
      expires_at
      id
      routes {
        base_fee_mtokens
        channel
        cltv_delta
        fee_rate
        public_key
      }
      tokens
    }
  }
`;

/**
 * __useDecodeRequestQuery__
 *
 * To run a query within a React component, call `useDecodeRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecodeRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecodeRequestQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDecodeRequestQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >(DecodeRequestDocument, baseOptions);
}
export function useDecodeRequestLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >(DecodeRequestDocument, baseOptions);
}
export type DecodeRequestQueryHookResult = ReturnType<
  typeof useDecodeRequestQuery
>;
export type DecodeRequestLazyQueryHookResult = ReturnType<
  typeof useDecodeRequestLazyQuery
>;
export type DecodeRequestQueryResult = ApolloReactCommon.QueryResult<
  DecodeRequestQuery,
  DecodeRequestQueryVariables
>;
