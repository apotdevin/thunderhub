import gql from 'graphql-tag';

export const GET_NODE = gql`
  query GetNode(
    $auth: authType!
    $publicKey: String!
    $withoutChannels: Boolean
  ) {
    getNode(
      auth: $auth
      publicKey: $publicKey
      withoutChannels: $withoutChannels
    ) {
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
