import { gql } from 'apollo-server-micro';

export const accountTypes = gql`
  type serverAccountType {
    name: String!
    id: String!
    type: String!
    loggedIn: Boolean!
  }
`;
