import { gql } from 'apollo-server-micro';

export const macaroonTypes = gql`
  type CreateMacaroon {
    base: String!
    hex: String!
  }
`;
