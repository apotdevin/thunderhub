import { gql } from '@apollo/client';

export const GET_TAP_OFFERS = gql`
  query GetTapOffers($input: GetTapOffersInput!) {
    magma {
      id
      get_tap_offers(input: $input) {
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
  }
`;
