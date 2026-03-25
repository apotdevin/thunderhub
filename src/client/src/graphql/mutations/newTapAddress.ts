import { gql } from '@apollo/client';

export const NEW_TAP_ADDRESS = gql`
  mutation NewTapAddress($assetId: String, $groupKey: String, $amt: Int!) {
    newTapAddress(assetId: $assetId, groupKey: $groupKey, amt: $amt) {
      encoded
      assetId
      amount
      scriptKey
      internalKey
      taprootOutputKey
    }
  }
`;
