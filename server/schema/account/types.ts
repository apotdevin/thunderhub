import { gql } from 'apollo-server-micro';

export type AccountType = {
  name: string;
  id: string;
  type: string;
  loggedIn: boolean;
};

export const accountTypes = gql`
  type serverAccountType {
    name: String!
    id: String!
    type: String!
    loggedIn: Boolean!
  }
`;
