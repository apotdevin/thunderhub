import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetResumeQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Float']>;
  limit?: Types.InputMaybe<Types.Scalars['Float']>;
}>;

export type GetResumeQuery = {
  __typename?: 'Query';
  getResume: {
    __typename?: 'GetResumeType';
    offset: number;
    resume: Array<
      | {
          __typename?: 'InvoiceType';
          chain_address?: string | null | undefined;
          confirmed_at?: string | null | undefined;
          created_at: string;
          description: string;
          description_hash?: string | null | undefined;
          expires_at: string;
          id: string;
          is_canceled?: boolean | null | undefined;
          is_confirmed: boolean;
          is_held?: boolean | null | undefined;
          is_private: boolean;
          is_push?: boolean | null | undefined;
          received: number;
          received_mtokens: string;
          request?: string | null | undefined;
          secret: string;
          tokens: string;
          type: string;
          date: string;
          payments: Array<{
            __typename?: 'InvoicePayment';
            in_channel: string;
            messages?:
              | {
                  __typename?: 'MessageType';
                  message?: string | null | undefined;
                }
              | null
              | undefined;
          }>;
        }
      | {
          __typename?: 'PaymentType';
          created_at: string;
          destination: string;
          fee: number;
          fee_mtokens: string;
          id: string;
          index?: number | null | undefined;
          is_confirmed: boolean;
          is_outgoing: boolean;
          mtokens: string;
          request?: string | null | undefined;
          safe_fee: number;
          safe_tokens?: number | null | undefined;
          secret: string;
          tokens: string;
          type: string;
          date: string;
          destination_node: {
            __typename?: 'Node';
            node?:
              | { __typename?: 'NodeType'; alias: string; public_key: string }
              | null
              | undefined;
          };
          hops: Array<{
            __typename?: 'Node';
            node?:
              | { __typename?: 'NodeType'; alias: string; public_key: string }
              | null
              | undefined;
          }>;
        }
    >;
  };
};

export const GetResumeDocument = gql`
  query GetResume($offset: Float, $limit: Float) {
    getResume(offset: $offset, limit: $limit) {
      offset
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
          payments {
            in_channel
            messages {
              message
            }
          }
        }
        ... on PaymentType {
          created_at
          destination
          destination_node {
            node {
              alias
              public_key
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
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetResumeQuery(
  baseOptions?: Apollo.QueryHookOptions<GetResumeQuery, GetResumeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    options
  );
}
export function useGetResumeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetResumeQuery,
    GetResumeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    options
  );
}
export type GetResumeQueryHookResult = ReturnType<typeof useGetResumeQuery>;
export type GetResumeLazyQueryHookResult = ReturnType<
  typeof useGetResumeLazyQuery
>;
export type GetResumeQueryResult = Apollo.QueryResult<
  GetResumeQuery,
  GetResumeQueryVariables
>;
