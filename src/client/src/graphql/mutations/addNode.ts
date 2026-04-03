import { gql } from '@apollo/client';

export const ADD_NODE = gql`
  mutation AddNode($input: AddNodeInput!) {
    team {
      add_node(input: $input) {
        id
        slug
        name
      }
    }
  }
`;
