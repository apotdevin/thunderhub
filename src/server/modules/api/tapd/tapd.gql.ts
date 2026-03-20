import { gql } from 'graphql-tag';

export const getOffersQuery = gql`
  query GetOffers($input: OfferInput!) {
    public {
      offers(input: $input) {
        list {
          id
          node {
            alias
            pubkey
          }
          rate {
            display_amount
            full_amount
          }
          available {
            display_amount
            full_amount
          }
          asset {
            id
            symbol
            description
            precision
            type
          }
        }
        total_count
        pagination {
          limit
          offset
        }
      }
    }
  }
`;
