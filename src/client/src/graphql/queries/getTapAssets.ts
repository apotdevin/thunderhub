import { gql } from '@apollo/client';

export const GET_TAP_ASSETS = gql`
  query GetTapAssets {
    taproot_assets {
      id
      get_assets {
        assets {
          asset_genesis {
            genesis_point
            name
            meta_hash
            asset_id
            asset_type
            output_index
          }
          amount
          lock_time
          relative_lock_time
          script_version
          script_key
          is_spent
          is_burn
        }
      }
    }
  }
`;
