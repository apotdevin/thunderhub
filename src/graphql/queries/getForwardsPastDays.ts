import { gql } from '@apollo/client';

export const GET_FORWARDS_PAST_DAYS = gql`
  query GetForwardsPastDays($days: Int!) {
    getForwardsPastDays(days: $days) {
      created_at
      fee
      fee_mtokens
      incoming_channel
      mtokens
      outgoing_channel
      tokens
      incoming_node {
        alias
        public_key
        channel_id
      }
      outgoing_node {
        alias
        public_key
        channel_id
      }
    }
  }
`;
