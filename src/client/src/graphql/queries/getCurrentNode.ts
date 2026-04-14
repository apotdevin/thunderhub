import { gql } from '@apollo/client';

export const GET_CURRENT_NODE = gql`
  query GetCurrentNode {
    node {
      id
      created_at
      network
      socket
    }
  }
`;
