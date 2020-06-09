import gql from 'graphql-tag';

export const GET_CHANNELS = gql`
  query GetChannels($auth: authType!, $active: Boolean) {
    getChannels(auth: $auth, active: $active) {
      capacity
      commit_transaction_fee
      commit_transaction_weight
      id
      is_active
      is_closing
      is_opening
      is_partner_initiated
      is_private
      is_static_remote_key
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      time_offline
      time_online
      transaction_id
      transaction_vout
      unsettled_balance
      partner_node_info {
        node {
          alias
          capacity
          channel_count
          color
          updated_at
        }
      }
      partner_fee_info {
        channel {
          partner_node_policies {
            base_fee_mtokens
            fee_rate
            cltv_delta
          }
        }
      }
    }
  }
`;
