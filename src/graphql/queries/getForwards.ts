import { gql } from '@apollo/client';

export const GET_FORWARDS = gql`
  query GetForwards($time: String) {
    getForwards(time: $time) {
      forwards {
        created_at
        fee
        fee_mtokens
        incoming_channel
        mtokens
        outgoing_channel
        tokens
        incoming_channel_info {
          channel {
            partner_node_policies {
              node {
                node {
                  alias
                  color
                }
              }
            }
          }
        }
        outgoing_channel_info {
          channel {
            partner_node_policies {
              node {
                node {
                  alias
                  color
                }
              }
            }
          }
        }
      }
      token
    }
  }
`;
