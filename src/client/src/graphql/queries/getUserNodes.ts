import { gql } from '@apollo/client';

export const GET_USER_NODES = gql`
  query GetUserNodes {
    user {
      get_nodes {
        id
        slug
        name
        network
        type
      }
    }
  }
`;
