import gql from 'graphql-tag';

export const GET_FORWARDS = gql`
  query GetForwards($auth: authType!, $time: String) {
    getForwards(auth: $auth, time: $time) {
      forwards {
        created_at
        fee
        fee_mtokens
        incoming_channel
        incoming_alias
        incoming_color
        mtokens
        outgoing_channel
        outgoing_alias
        outgoing_color
        tokens
      }
      token
    }
  }
`;
