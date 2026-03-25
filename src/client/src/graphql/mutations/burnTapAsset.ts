import { gql } from '@apollo/client';

export const BURN_TAP_ASSET = gql`
  mutation BurnTapAsset($assetId: String!, $amount: Int!) {
    burnTapAsset(assetId: $assetId, amount: $amount)
  }
`;
