import { gql } from '@apollo/client';

export const GET_TAP_SUPPORTED_ASSETS = gql`
  query GetTapSupportedAssets {
    rails {
      get_tap_supported_assets {
        list {
          id
          symbol
          description
          precision
          assetId
          groupKey
          universeHost
          prices {
            usd
          }
        }
      }
    }
  }
`;
