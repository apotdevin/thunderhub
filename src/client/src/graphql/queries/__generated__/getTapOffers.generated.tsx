import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type GetTapOffersQueryVariables = {
  assetId: string;
  transactionType: string;
  sortBy?: string | null;
  sortDir?: string | null;
  minAmount?: string | null;
  limit?: number | null;
  offset?: number | null;
};

export type GetTapOffersQuery = {
  __typename?: 'Query';
  getTapOffers: {
    __typename?: 'TapTradeOfferList';
    totalCount: number;
    list: {
      __typename?: 'TapTradeOffer';
      id: string;
      node: {
        __typename?: 'TapTradeOfferNode';
        alias?: string | null;
        pubkey?: string | null;
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
    }[];
  };
};

export const GetTapOffersDocument = gql`
  query GetTapOffers(
    $assetId: String!
    $transactionType: String!
    $sortBy: String
    $sortDir: String
    $minAmount: String
    $limit: Int
    $offset: Int
  ) {
    getTapOffers(
      assetId: $assetId
      transactionType: $transactionType
      sortBy: $sortBy
      sortDir: $sortDir
      minAmount: $minAmount
      limit: $limit
      offset: $offset
    ) {
      list {
        id
        node {
          alias
          pubkey
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

export function useGetTapOffersQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTapOffersQuery,
    GetTapOffersQueryVariables
  >
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
