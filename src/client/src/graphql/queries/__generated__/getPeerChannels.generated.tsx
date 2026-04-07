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
    }
  }
`;

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
export type GetPeerChannelsQueryHookResult = ReturnType<
  typeof useGetPeerChannelsQuery
>;
export type GetPeerChannelsLazyQueryHookResult = ReturnType<
  typeof useGetPeerChannelsLazyQuery
>;
export type GetPeerChannelsQueryResult = Apollo.QueryResult<
  GetPeerChannelsQuery,
  GetPeerChannelsQueryVariables
>;
