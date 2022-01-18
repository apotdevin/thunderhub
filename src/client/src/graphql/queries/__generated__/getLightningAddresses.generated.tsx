import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetLightningAddressesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLightningAddressesQuery = {
  __typename?: 'Query';
  getLightningAddresses: Array<{
    __typename?: 'LightningAddress';
    pubkey: string;
    lightning_address: string;
  }>;
};

export const GetLightningAddressesDocument = gql`
  query GetLightningAddresses {
    getLightningAddresses {
      pubkey
      lightning_address
    }
  }
`;

/**
 * __useGetLightningAddressesQuery__
 *
 * To run a query within a React component, call `useGetLightningAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLightningAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLightningAddressesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLightningAddressesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLightningAddressesQuery,
    GetLightningAddressesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLightningAddressesQuery,
    GetLightningAddressesQueryVariables
  >(GetLightningAddressesDocument, options);
}
export function useGetLightningAddressesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLightningAddressesQuery,
    GetLightningAddressesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLightningAddressesQuery,
    GetLightningAddressesQueryVariables
  >(GetLightningAddressesDocument, options);
}
export type GetLightningAddressesQueryHookResult = ReturnType<
  typeof useGetLightningAddressesQuery
>;
export type GetLightningAddressesLazyQueryHookResult = ReturnType<
  typeof useGetLightningAddressesLazyQuery
>;
export type GetLightningAddressesQueryResult = Apollo.QueryResult<
  GetLightningAddressesQuery,
  GetLightningAddressesQueryVariables
>;
