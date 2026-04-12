import gql from 'graphql-tag';

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

export const getSupportedAssetsQuery = gql`
  query GetSupportedAssets($input: SupportedAssetsInput) {
    public {
      assets {
        supported(input: $input) {
          list {
            id
            symbol
            description
            precision
            type
            prices {
              id
              usd
            }
            taproot_asset_details {
              asset_id
              group_key
              universe
            }
          }
          total_count
        }
      }
    }
  }
`;
