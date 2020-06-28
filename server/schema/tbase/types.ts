import { gql } from 'apollo-server-micro';

export const tbaseTypes = gql`
  type baseNodesType {
    _id: String
    name: String
    public_key: String
    socket: String
  }
`;
