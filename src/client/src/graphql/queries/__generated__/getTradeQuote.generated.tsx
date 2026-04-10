import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTradeQuoteQueryVariables = Types.Exact<{
  input: Types.TradeQuoteInput;
}>;

export type GetTradeQuoteQuery = {
  __typename?: 'Query';
  getTradeQuote: {
    __typename?: 'TradeQuoteResult';
    satsAmount: string;
    assetAmount: string;
    rateFixed?: string | null;
    paymentRequest?: string | null;
    rfqId?: string | null;
    expiryEpoch?: string | null;
  };
};

export const GetTradeQuoteDocument = gql`
  query GetTradeQuote($input: TradeQuoteInput!) {
    getTradeQuote(input: $input) {
      satsAmount
      assetAmount
      rateFixed
      paymentRequest
      rfqId
      expiryEpoch
    }
  }
`;

/**
 * __useGetTradeQuoteQuery__
 *
 * To run a query within a React component, call `useGetTradeQuoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradeQuoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradeQuoteQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTradeQuoteQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTradeQuoteQuery,
    GetTradeQuoteQueryVariables
  > &
    (
      | { variables: GetTradeQuoteQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTradeQuoteQuery, GetTradeQuoteQueryVariables>(
    GetTradeQuoteDocument,
    options
  );
}
export function useGetTradeQuoteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradeQuoteQuery,
    GetTradeQuoteQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTradeQuoteQuery, GetTradeQuoteQueryVariables>(
    GetTradeQuoteDocument,
    options
  );
}
// @ts-ignore
export function useGetTradeQuoteSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTradeQuoteQuery,
    GetTradeQuoteQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTradeQuoteQuery,
  GetTradeQuoteQueryVariables
>;
export function useGetTradeQuoteSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeQuoteQuery,
        GetTradeQuoteQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTradeQuoteQuery | undefined,
  GetTradeQuoteQueryVariables
>;
export function useGetTradeQuoteSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeQuoteQuery,
        GetTradeQuoteQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTradeQuoteQuery,
    GetTradeQuoteQueryVariables
  >(GetTradeQuoteDocument, options);
}
export type GetTradeQuoteQueryHookResult = ReturnType<
  typeof useGetTradeQuoteQuery
>;
export type GetTradeQuoteLazyQueryHookResult = ReturnType<
  typeof useGetTradeQuoteLazyQuery
>;
export type GetTradeQuoteSuspenseQueryHookResult = ReturnType<
  typeof useGetTradeQuoteSuspenseQuery
>;
export type GetTradeQuoteQueryResult = Apollo.QueryResult<
  GetTradeQuoteQuery,
  GetTradeQuoteQueryVariables
>;
