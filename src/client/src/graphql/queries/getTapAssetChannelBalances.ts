import { gql } from '@apollo/client';

export const GET_TAP_ASSET_CHANNEL_BALANCES = gql`
  query GetTapAssetChannelBalances($peerPubkey: String) {
    getTapAssetChannelBalances(peerPubkey: $peerPubkey) {
      channelPoint
      partnerPublicKey
      assetId
      localBalance
      remoteBalance
      capacity
    }
  }
`;
