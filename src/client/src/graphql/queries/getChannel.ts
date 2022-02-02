import { gql } from '@apollo/client';

export const GET_CHANNEL = gql`
  query GetChannel($id: String!) {
    getChannel(id: $id) {
      partner_node_policies {
        node {
          node {
            alias
            public_key
          }
        }
      }
    }
  }
`;

export const GET_CHANNEL_INFO = gql`
  query GetChannelInfo($id: String!) {
    getChannel(id: $id) {
      transaction_id
      transaction_vout
      node_policies {
        base_fee_mtokens
        max_htlc_mtokens
        min_htlc_mtokens
        fee_rate
        cltv_delta
      }
      partner_node_policies {
        node {
          node {
            alias
          }
        }
      }
    }
  }
`;
