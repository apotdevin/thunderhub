import { gql } from '@apollo/client';

export const GET_FORWARDS = gql`
  query GetForwards($days: Float!) {
    getForwards(days: $days) {
      created_at
      fee
      fee_mtokens
      incoming_channel
      mtokens
      outgoing_channel
      tokens
      incoming_channel_info {
        node1_info {
          alias
        }
        node2_info {
          alias
        }
      }
      outgoing_channel_info {
        node1_info {
          alias
        }
        node2_info {
          alias
        }
      }
    }
  }
`;
