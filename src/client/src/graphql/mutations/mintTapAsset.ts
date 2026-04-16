import { gql } from '@apollo/client';

export const MINT_TAP_ASSET = gql`
  mutation MintTapAsset($input: TapMintAssetInput!) {
    taproot_assets {
      mint_asset(input: $input) {
        batch_key
      }
    }
  }
`;
