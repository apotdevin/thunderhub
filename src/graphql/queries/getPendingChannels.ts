import { gql } from '@apollo/client';

export const GET_PENDING_CHANNELS = gql`
  query GetPendingChannels {
    getPendingChannels {
      close_transaction_id
      is_active
      is_closing
      is_opening
      is_timelocked
      local_balance
      local_reserve
      timelock_blocks
      timelock_expiration
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      transaction_fee
      transaction_id
      transaction_vout
      partner_node_info {
        node {
          alias
          capacity
          channel_count
          color
          updated_at
        }
      }
    }
  }
`;
