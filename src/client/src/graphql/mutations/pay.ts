import { gql } from '@apollo/client';

export const PAY = gql`
  mutation Pay(
    $max_fee: Float!
    $max_paths: Float!
    $out: [String!]
    $request: String!
  ) {
    pay(max_fee: $max_fee, max_paths: $max_paths, out: $out, request: $request)
  }
`;
