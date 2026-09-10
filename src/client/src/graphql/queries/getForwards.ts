import { gql } from '@apollo/client';

export const GET_FORWARDS_LIST = gql`
  query GetForwardsList($days: Float!, $limit: Float, $offset: Float) {
    getForwards(days: $days) {
      summary {
        count
      }
      list(limit: $limit, offset: $offset) {
        id
        created_at
        fee
        fee_mtokens
        incoming_channel
        mtokens
        outgoing_channel
        tokens
      }
    }
  }
`;

export const GET_FORWARDS_GRAPH = gql`
  query GetForwardsGraph($days: Float!) {
    getForwards(days: $days) {
      summary {
        count
      }
      by_time {
        date
        tokens
        fee
        count
      }
    }
  }
`;

export const GET_FORWARDS_CHANNELS = gql`
  query GetForwardsChannels($days: Float!) {
    getForwards(days: $days) {
      by_channel {
        id
        incoming {
          id
          count
          fee
          fee_mtokens
          mtokens
          tokens
        }
        outgoing {
          id
          count
          fee
          fee_mtokens
          mtokens
          tokens
        }
        channel
        channel_info {
          node2_info {
            alias
            public_key
          }
        }
      }
      by_incoming {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
      }
      by_outgoing {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
      }
      by_route {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        route
        incoming_channel
        outgoing_channel
      }
    }
  }
`;

export const GET_FORWARDS_SUMMARY = gql`
  query GetForwardsSummary($days: Float!) {
    getForwards(days: $days) {
      summary {
        count
        day {
          count
          fee
          fee_mtokens
          tokens
        }
        week {
          count
          fee
          fee_mtokens
          tokens
        }
        month {
          count
          fee
          fee_mtokens
          tokens
        }
        year {
          count
          fee
          fee_mtokens
          tokens
        }
      }
    }
  }
`;
