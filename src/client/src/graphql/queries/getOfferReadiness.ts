import { gql } from '@apollo/client';

export const GET_OFFER_READINESS = gql`
  query GetOfferReadiness($input: OfferReadinessInput!) {
    rails {
      id
      offer_readiness(input: $input) {
        is_peer_connected
        has_pending_order
        btc_channels {
          open_count
          pending_count
          total_local_sats
          total_remote_sats
          has_active_channel
        }
        asset_channels {
          open_count
          pending_count
          total_local_atomic
          total_remote_atomic
          has_active_channel
        }
      }
    }
  }
`;
