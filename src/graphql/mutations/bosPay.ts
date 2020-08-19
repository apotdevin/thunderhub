import { gql } from '@apollo/client';

export const BOS_PAY = gql`
  mutation BosPay(
    $max_fee: Int!
    $max_paths: Int!
    $message: String
    $out: [String]
    $request: String!
  ) {
    bosPay(
      max_fee: $max_fee
      max_paths: $max_paths
      message: $message
      out: $out
      request: $request
    )
  }
`;
