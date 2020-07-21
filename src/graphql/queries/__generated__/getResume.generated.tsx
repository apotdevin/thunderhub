import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetResumeQueryVariables = Types.Exact<{
  auth: Types.AuthType;
  token?: Types.Maybe<Types.Scalars['String']>;
}>;

export type GetResumeQuery = { __typename?: 'Query' } & {
  getResume?: Types.Maybe<
    { __typename?: 'getResumeType' } & Pick<Types.GetResumeType, 'token'> & {
        resume?: Types.Maybe<
          Array<
            Types.Maybe<
              | ({ __typename?: 'InvoiceType' } & Pick<
                  Types.InvoiceType,
                  | 'chain_address'
                  | 'confirmed_at'
                  | 'created_at'
                  | 'description'
                  | 'description_hash'
                  | 'expires_at'
                  | 'id'
                  | 'is_canceled'
                  | 'is_confirmed'
                  | 'is_held'
                  | 'is_private'
                  | 'is_push'
                  | 'received'
                  | 'received_mtokens'
                  | 'request'
                  | 'secret'
                  | 'tokens'
                  | 'type'
                  | 'date'
                >)
              | ({ __typename?: 'PaymentType' } & Pick<
                  Types.PaymentType,
                  | 'created_at'
                  | 'destination'
                  | 'fee'
                  | 'fee_mtokens'
                  | 'id'
                  | 'index'
                  | 'is_confirmed'
                  | 'is_outgoing'
                  | 'mtokens'
                  | 'request'
                  | 'safe_fee'
                  | 'safe_tokens'
                  | 'secret'
                  | 'tokens'
                  | 'type'
                  | 'date'
                > & {
                    destination_node?: Types.Maybe<
                      { __typename?: 'Node' } & {
                        node: { __typename?: 'nodeType' } & Pick<
                          Types.NodeType,
                          'alias'
                        >;
                      }
                    >;
                    hops: Array<
                      { __typename?: 'Node' } & {
                        node: { __typename?: 'nodeType' } & Pick<
                          Types.NodeType,
                          'alias' | 'public_key'
                        >;
                      }
                    >;
                  })
            >
          >
        >;
      }
  >;
};

export const GetResumeDocument = gql`
  query GetResume($auth: authType!, $token: String) {
    getResume(auth: $auth, token: $token) {
      token
      resume {
        ... on InvoiceType {
          chain_address
          confirmed_at
          created_at
          description
          description_hash
          expires_at
          id
          is_canceled
          is_confirmed
          is_held
          is_private
          is_push
          received
          received_mtokens
          request
          secret
          tokens
          type
          date
        }
        ... on PaymentType {
          created_at
          destination
          destination_node {
            node {
              alias
            }
          }
          fee
          fee_mtokens
          hops {
            node {
              alias
              public_key
            }
          }
          id
          index
          is_confirmed
          is_outgoing
          mtokens
          request
          safe_fee
          safe_tokens
          secret
          tokens
          type
          date
        }
      }
    }
  }
`;

/**
 * __useGetResumeQuery__
 *
 * To run a query within a React component, call `useGetResumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResumeQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetResumeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetResumeQuery,
    GetResumeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    baseOptions
  );
}
export function useGetResumeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetResumeQuery,
    GetResumeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    baseOptions
  );
}
export type GetResumeQueryHookResult = ReturnType<typeof useGetResumeQuery>;
export type GetResumeLazyQueryHookResult = ReturnType<
  typeof useGetResumeLazyQuery
>;
export type GetResumeQueryResult = ApolloReactCommon.QueryResult<
  GetResumeQuery,
  GetResumeQueryVariables
>;
