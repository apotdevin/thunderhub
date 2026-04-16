import { gql } from '@apollo/client';

export const DECODE_TAP_ADDRESS = gql`
  query DecodeTapAddress($addr: String!) {
    taproot_assets {
      id
      decode_address(addr: $addr) {
        encoded
        asset_id
        group_key
        amount
        asset_type
      }
    }
  }
`;
