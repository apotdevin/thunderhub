import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query GetChannels($active: Boolean) {
    getChannels(active: $active) {
      capacity
      commit_transaction_fee
      commit_transaction_weight
      id
      is_active
      is_closing
      is_opening
      is_partner_initiated
      is_private
      local_balance
      local_reserve
      partner_public_key
      past_states
      received
      remote_balance
      remote_reserve
      sent
      time_offline
      time_online
      transaction_id
      transaction_vout
      unsettled_balance
      channel_age
      pending_resume {
        incoming_tokens
        outgoing_tokens
        incoming_amount
        outgoing_amount
        total_tokens
        total_amount
      }
      partner_node_info {
        node {
          alias
        }
      }
      partner_fee_info {
        node_policies {
          base_fee_mtokens
          fee_rate
          cltv_delta
          max_htlc_mtokens
          min_htlc_mtokens
        }
        partner_node_policies {
          base_fee_mtokens
          fee_rate
          cltv_delta
          max_htlc_mtokens
          min_htlc_mtokens
        }
      }
    }
  }
`;

export const GET_CHANNELS_WITH_PEERS = gql`
  query GetChannelsWithPeers($active: Boolean) {
    getChannels(active: $active) {
      partner_public_key
      partner_node_info {
        node {
          alias
          id
        }
      }
    }
  }
`;
