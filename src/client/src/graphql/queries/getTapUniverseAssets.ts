import { gql } from '@apollo/client';

export const GET_TAP_UNIVERSE_ASSETS = gql`
  query GetTapUniverseAssets {
    taproot_assets {
      id
      get_universe_assets {
        assets {
          name
          asset_id
          group_key
          total_supply
        }
      }
    }
  }
`;
