import { gql } from '@apollo/client';

export const BURN_TAP_ASSET = gql`
  mutation BurnTapAsset($asset_id: String!, $amount: String!) {
    taproot_assets {
      burn_asset(asset_id: $asset_id, amount: $amount)
    }
  }
`;
