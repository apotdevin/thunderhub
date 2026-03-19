import { gql } from '@apollo/client';

export const MINT_TAP_ASSET = gql`
  mutation MintTapAsset(
    $name: String!
    $amount: Int!
    $assetType: TapAssetType
    $groupKey: String
  ) {
    mintTapAsset(
      name: $name
      amount: $amount
      assetType: $assetType
      groupKey: $groupKey
    ) {
      batchKey
    }
  }
`;
