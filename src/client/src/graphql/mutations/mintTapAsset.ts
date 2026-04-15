import { gql } from '@apollo/client';

export const MINT_TAP_ASSET = gql`
  mutation MintTapAsset(
    $name: String!
    $amount: String!
    $assetType: TapAssetType
    $grouped: Boolean
    $groupKey: String
    $precision: Int!
  ) {
    mintTapAsset(
      name: $name
      amount: $amount
      assetType: $assetType
      grouped: $grouped
      groupKey: $groupKey
      precision: $precision
    ) {
      batchKey
    }
  }
`;
