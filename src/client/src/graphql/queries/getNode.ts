import { gql } from '@apollo/client';

export const GET_NODE = gql`
  query GetNode($publicKey: String!, $withoutChannels: Boolean) {
    getNode(publicKey: $publicKey, withoutChannels: $withoutChannels) {
      node {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;
