import { gql } from 'apollo-server-micro';

export const lnpayTypes = gql`
  type lnPayInfoType {
    max: Int
    min: Int
  }
`;
