import gql from 'graphql-tag';

export const GET_PENDING_CHANNELS = gql`
  query GetPendingChannels($auth: authType!) {
    getPendingChannels(auth: $auth) {
      close_transaction_id
      is_active
      is_closing
      is_opening
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      transaction_fee
      transaction_id
      transaction_vout
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;
