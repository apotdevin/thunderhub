import gql from 'graphql-tag';

export const GET_FORWARDS = gql`
  query GetForwards($auth: authType!, $time: String) {
    getForwards(auth: $auth, time: $time) {
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
            policies {
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
            policies {
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
