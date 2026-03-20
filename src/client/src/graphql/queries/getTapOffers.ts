import { gql } from '@apollo/client';

export const GET_TAP_OFFERS = gql`
  query GetTapOffers(
    $assetId: String!
    $transactionType: String!
    $sortBy: String
    $sortDir: String
    $limit: Int
    $offset: Int
  ) {
    getTapOffers(
      assetId: $assetId
      transactionType: $transactionType
      sortBy: $sortBy
      sortDir: $sortDir
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
