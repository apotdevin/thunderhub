import { gql } from '@apollo/client';

export const GET_PEER_CHANNELS = gql`
  query GetPeerChannels($partner_public_key: String!) {
    getChannels(partner_public_key: $partner_public_key) {
      id
      capacity
      local_balance
      remote_balance
      is_active
      partner_public_key
      transaction_id
      transaction_vout
    }
  }
`;
