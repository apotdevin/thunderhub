import { gql } from '@apollo/client';

export const BURN_TAP_ASSET = gql`
  mutation BurnTapAsset($assetId: String!, $amount: String!) {
    burnTapAsset(assetId: $assetId, amount: $amount)
  }
`;
