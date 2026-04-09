import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapOffersQueryVariables = Types.Exact<{
  input: Types.GetTapOffersInput;
}>;

export type GetTapOffersQuery = {
  __typename?: 'Query';
  getTapOffers: {
    __typename?: 'TapTradeOfferList';
    totalCount: number;
    list: Array<{
      __typename?: 'TapTradeOffer';
      id: string;
      magmaOfferId: string;
      node: {
        __typename?: 'TapTradeOfferNode';
        alias?: string | null;
        pubkey?: string | null;
        sockets: Array<string>;
      };
      rate: {
        __typename?: 'TapTradeOfferAmount';
        displayAmount?: string | null;
        fullAmount?: string | null;
      };
      available: {
        __typename?: 'TapTradeOfferAmount';
        displayAmount?: string | null;
        fullAmount?: string | null;
      };
    }>;
  };
};

export const GetTapOffersDocument = gql`
  query GetTapOffers($input: GetTapOffersInput!) {
    getTapOffers(input: $input) {
      list {
        id
        magmaOfferId
        node {
          alias
          pubkey
          sockets
        }
        rate {
          displayAmount
          fullAmount
        }
        available {
          displayAmount
          fullAmount
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetTapOffersQuery__
 *
 * To run a query within a React component, call `useGetTapOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapOffersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTapOffersQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTapOffersQuery,
    GetTapOffersQueryVariables
  > &
    (
      | { variables: GetTapOffersQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapOffersQuery, GetTapOffersQueryVariables>(
    GetTapOffersDocument,
    options
  );
}
export function useGetTapOffersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapOffersQuery,
    GetTapOffersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTapOffersQuery, GetTapOffersQueryVariables>(
    GetTapOffersDocument,
    options
  );
}
// @ts-ignore
export function useGetTapOffersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapOffersQuery,
    GetTapOffersQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTapOffersQuery, GetTapOffersQueryVariables>;
export function useGetTapOffersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapOffersQuery,
        GetTapOffersQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapOffersQuery | undefined,
  GetTapOffersQueryVariables
>;
export function useGetTapOffersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapOffersQuery,
        GetTapOffersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTapOffersQuery, GetTapOffersQueryVariables>(
    GetTapOffersDocument,
    options
  );
}
export type GetTapOffersQueryHookResult = ReturnType<
  typeof useGetTapOffersQuery
>;
export type GetTapOffersLazyQueryHookResult = ReturnType<
  typeof useGetTapOffersLazyQuery
>;
export type GetTapOffersSuspenseQueryHookResult = ReturnType<
  typeof useGetTapOffersSuspenseQuery
>;
export type GetTapOffersQueryResult = Apollo.QueryResult<
  GetTapOffersQuery,
  GetTapOffersQueryVariables
>;
