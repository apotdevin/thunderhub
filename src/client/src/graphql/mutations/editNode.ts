import { gql } from '@apollo/client';

export const EDIT_NODE = gql`
  mutation EditNode($input: EditNodeInput!) {
    team {
      edit_node(input: $input) {
        id
        slug
        name
      }
    }
  }
`;
