import { gql } from '@apollo/client';

export const FUND_TAP_ASSET_CHANNEL = gql`
  mutation FundTapAssetChannel(
    $peerPubkey: String!
    $assetAmount: Int!
    $groupKey: String
    $assetId: String
    $feeRateSatPerVbyte: Int
    $pushSat: Int
  ) {
    fundTapAssetChannel(
      peerPubkey: $peerPubkey
      assetAmount: $assetAmount
      groupKey: $groupKey
      assetId: $assetId
      feeRateSatPerVbyte: $feeRateSatPerVbyte
      pushSat: $pushSat
    ) {
      txid
      outputIndex
    }
  }
`;
