import { gql } from '@apollo/client';

export const GET_FORWARDS = gql`
  query GetForwards($days: Float!) {
    getForwards(days: $days) {
      list {
        id
        created_at
        fee
        fee_mtokens
        incoming_channel
        mtokens
        outgoing_channel
        tokens
      }
      by_incoming {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
        channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
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
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
      by_outgoing {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
        channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
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
        incoming_channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
        outgoing_channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
    }
  }
`;

export const GET_FORWARDS_LIST = gql`
  query GetForwardsList($days: Float!) {
    getForwards(days: $days) {
      list {
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
