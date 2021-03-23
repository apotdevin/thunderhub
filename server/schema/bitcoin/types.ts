import { gql } from 'apollo-server-micro';

export const bitcoinTypes = gql`
  type bitcoinFeeType {
    fast: Int
    halfHour: Int
    hour: Int
    minimum: Int
  }
`;
