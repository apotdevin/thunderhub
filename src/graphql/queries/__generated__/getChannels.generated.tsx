import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetChannelsQueryVariables = Types.Exact<{
  auth: Types.AuthType;
  active?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type GetChannelsQuery = { __typename?: 'Query' } & {
  getChannels: Array<
    Types.Maybe<
      { __typename?: 'channelType' } & Pick<
        Types.ChannelType,
        | 'capacity'
        | 'commit_transaction_fee'
        | 'commit_transaction_weight'
        | 'id'
        | 'is_active'
        | 'is_closing'
        | 'is_opening'
        | 'is_partner_initiated'
        | 'is_private'
        | 'is_static_remote_key'
        | 'local_balance'
        | 'local_reserve'
        | 'partner_public_key'
        | 'received'
        | 'remote_balance'
        | 'remote_reserve'
        | 'sent'
        | 'time_offline'
        | 'time_online'
        | 'transaction_id'
        | 'transaction_vout'
        | 'unsettled_balance'
        | 'channel_age'
      > & {
          partner_node_info: { __typename?: 'Node' } & {
            node: { __typename?: 'nodeType' } & Pick<
              Types.NodeType,
              'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
            >;
          };
          partner_fee_info?: Types.Maybe<
            { __typename?: 'Channel' } & {
              channel?: Types.Maybe<
                { __typename?: 'singleChannelType' } & {
                  partner_node_policies?: Types.Maybe<
                    { __typename?: 'nodePolicyType' } & Pick<
                      Types.NodePolicyType,
                      'base_fee_mtokens' | 'fee_rate' | 'cltv_delta'
                    >
                  >;
                }
              >;
            }
          >;
        }
    >
  >;
};

export const GetChannelsDocument = gql`
  query GetChannels($auth: authType!, $active: Boolean) {
    getChannels(auth: $auth, active: $active) {
      capacity
      commit_transaction_fee
      commit_transaction_weight
      id
      is_active
      is_closing
      is_opening
      is_partner_initiated
      is_private
      is_static_remote_key
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      time_offline
      time_online
      transaction_id
      transaction_vout
      unsettled_balance
      channel_age
      partner_node_info {
        node {
          alias
          capacity
          channel_count
          color
          updated_at
        }
      }
      partner_fee_info {
        channel {
          partner_node_policies {
            base_fee_mtokens
            fee_rate
            cltv_delta
          }
        }
      }
    }
  }
`;

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useGetChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    baseOptions
  );
}
export function useGetChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >(GetChannelsDocument, baseOptions);
}
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<
  typeof useGetChannelsLazyQuery
>;
export type GetChannelsQueryResult = ApolloReactCommon.QueryResult<
  GetChannelsQuery,
  GetChannelsQueryVariables
>;
