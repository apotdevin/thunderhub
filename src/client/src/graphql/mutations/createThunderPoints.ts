import { gql } from '@apollo/client';

export const CREATE_THUNDER_POINTS = gql`
  mutation CreateThunderPoints(
    $id: String!
    $alias: String!
    $uris: [String!]!
    $public_key: String!
  ) {
    createThunderPoints(
      id: $id
      alias: $alias
      uris: $uris
      public_key: $public_key
    )
  }
`;
