import { gql } from '@apollo/client';

export const GET_TAP_ASSET_CHANNEL_BALANCES = gql`
  query GetTapAssetChannelBalances($peer_pubkey: String) {
    taproot_assets {
      get_asset_channel_balances(peer_pubkey: $peer_pubkey) {
        channel_point
        partner_public_key
        asset_id
        group_key
        local_balance
        remote_balance
        capacity
      }
    }
  }
`;
