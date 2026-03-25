import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DecodeTapAddressQueryVariables = Types.Exact<{
  addr: Types.Scalars['String']['input'];
}>;

export type DecodeTapAddressQuery = {
  __typename?: 'Query';
  decodeTapAddress: {
    __typename?: 'TapAddress';
    encoded: string;
    assetId: string;
    groupKey?: string | null;
    amount: string;
    assetType?: string | null;
  };
};

export const DecodeTapAddressDocument = gql`
  query DecodeTapAddress($addr: String!) {
    decodeTapAddress(addr: $addr) {
      encoded
      assetId
      groupKey
      amount
      assetType
    }
  }
`;

/**
 * __useDecodeTapAddressQuery__
 *
 * To run a query within a React component, call `useDecodeTapAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecodeTapAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecodeTapAddressQuery({
 *   variables: {
 *      addr: // value for 'addr'
 *   },
 * });
 */
export function useDecodeTapAddressQuery(
  baseOptions: Apollo.QueryHookOptions<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  > &
    (
      | { variables: DecodeTapAddressQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DecodeTapAddressQuery, DecodeTapAddressQueryVariables>(
    DecodeTapAddressDocument,
    options
  );
}
export function useDecodeTapAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >(DecodeTapAddressDocument, options);
}
// @ts-ignore
export function useDecodeTapAddressSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  DecodeTapAddressQuery,
  DecodeTapAddressQueryVariables
>;
export function useDecodeTapAddressSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        DecodeTapAddressQuery,
        DecodeTapAddressQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  DecodeTapAddressQuery | undefined,
  DecodeTapAddressQueryVariables
>;
export function useDecodeTapAddressSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        DecodeTapAddressQuery,
        DecodeTapAddressQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DecodeTapAddressQuery,
    DecodeTapAddressQueryVariables
  >(DecodeTapAddressDocument, options);
}
export type DecodeTapAddressQueryHookResult = ReturnType<
  typeof useDecodeTapAddressQuery
>;
export type DecodeTapAddressLazyQueryHookResult = ReturnType<
  typeof useDecodeTapAddressLazyQuery
>;
export type DecodeTapAddressSuspenseQueryHookResult = ReturnType<
  typeof useDecodeTapAddressSuspenseQuery
>;
export type DecodeTapAddressQueryResult = Apollo.QueryResult<
  DecodeTapAddressQuery,
  DecodeTapAddressQueryVariables
>;
