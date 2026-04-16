import { gql } from '@apollo/client';

export const SEND_TAP_ASSET = gql`
  mutation SendTapAsset($tap_addrs: [String!]!) {
    taproot_assets {
      send_asset(tap_addrs: $tap_addrs)
    }
  }
`;
