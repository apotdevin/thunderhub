import { gql } from 'apollo-server-micro';

export const tbaseTypes = gql`
  type baseNodesType {
    _id: String
    name: String
    public_key: String!
    socket: String!
  }

  type basePointsType {
    alias: String!
    amount: Int!
  }

  type baseInvoiceType {
    id: String!
    request: String!
  }
`;
