import { gql } from '@apollo/client';

export const GET_CHANNEL = gql`
  query GetChannel($id: String!, $pubkey: String) {
    getChannel(id: $id, pubkey: $pubkey) {
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
