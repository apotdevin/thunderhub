import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetLightningAddressInfoQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;

export type GetLightningAddressInfoQuery = {
  __typename?: 'Query';
  getLightningAddressInfo: {
    __typename?: 'PayRequest';
    callback?: string | null | undefined;
    maxSendable?: string | null | undefined;
    minSendable?: string | null | undefined;
    metadata?: string | null | undefined;
    commentAllowed?: number | null | undefined;
    tag?: string | null | undefined;
  };
};

export const GetLightningAddressInfoDocument = gql`
  query GetLightningAddressInfo($address: String!) {
    getLightningAddressInfo(address: $address) {
      callback
      maxSendable
      minSendable
      metadata
      commentAllowed
      tag
    }
  }
`;

/**
 * __useGetLightningAddressInfoQuery__
 *
 * To run a query within a React component, call `useGetLightningAddressInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLightningAddressInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLightningAddressInfoQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetLightningAddressInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLightningAddressInfoQuery,
    GetLightningAddressInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLightningAddressInfoQuery,
    GetLightningAddressInfoQueryVariables
  >(GetLightningAddressInfoDocument, options);
}
export function useGetLightningAddressInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLightningAddressInfoQuery,
    GetLightningAddressInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLightningAddressInfoQuery,
    GetLightningAddressInfoQueryVariables
  >(GetLightningAddressInfoDocument, options);
}
export type GetLightningAddressInfoQueryHookResult = ReturnType<
  typeof useGetLightningAddressInfoQuery
>;
export type GetLightningAddressInfoLazyQueryHookResult = ReturnType<
  typeof useGetLightningAddressInfoLazyQuery
>;
export type GetLightningAddressInfoQueryResult = Apollo.QueryResult<
  GetLightningAddressInfoQuery,
  GetLightningAddressInfoQueryVariables
>;
