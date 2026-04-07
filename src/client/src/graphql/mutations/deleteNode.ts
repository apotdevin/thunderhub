import { gql } from '@apollo/client';

export const DELETE_NODE = gql`
  mutation DeleteNode($slug: String!) {
    team {
      delete_node(slug: $slug) {
        success
      }
    }
  }
`;
