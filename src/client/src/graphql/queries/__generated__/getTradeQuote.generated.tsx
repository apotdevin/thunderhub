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
    amountSats: string;
    assetAmount: string;
    rateFixed?: string | null;
  };
};

export const GetTradeQuoteDocument = gql`
  query GetTradeQuote($input: TradeQuoteInput!) {
    getTradeQuote(input: $input) {
      amountSats
      assetAmount
      rateFixed
    }
  }
`;

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
export type GetTradeQuoteQueryHookResult = ReturnType<
  typeof useGetTradeQuoteQuery
>;
export type GetTradeQuoteLazyQueryHookResult = ReturnType<
  typeof useGetTradeQuoteLazyQuery
>;
export type GetTradeQuoteQueryResult = Apollo.QueryResult<
  GetTradeQuoteQuery,
  GetTradeQuoteQueryVariables
>;
