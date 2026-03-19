import { gql } from '@apollo/client';

export const DECODE_TAP_ADDRESS = gql`
  query DecodeTapAddress($addr: String!) {
    decodeTapAddress(addr: $addr) {
      encoded
      assetId
      groupKey
      amount
      assetType
    }
  }
`;
