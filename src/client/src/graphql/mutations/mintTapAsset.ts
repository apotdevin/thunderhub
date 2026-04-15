import { gql } from '@apollo/client';

export const MINT_TAP_ASSET = gql`
  mutation MintTapAsset($input: TapMintAssetInput!) {
    mintTapAsset(input: $input) {
      batchKey
    }
  }
`;
