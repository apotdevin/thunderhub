import { gql } from '@apollo/client';

export const GET_CLOSED_CHANNELS = gql`
  query GetClosedChannels {
    getClosedChannels {
      capacity
      close_confirm_height
      close_transaction_id
      closed_for_blocks
      final_local_balance
      final_time_locked_balance
      id
      is_breach_close
      is_cooperative_close
      is_funding_cancel
      is_local_force_close
      is_remote_force_close
      partner_public_key
      transaction_id
      transaction_vout
      channel_age
      partner_node_info {
        node {
          alias
        }
      }
    }
  }
`;
