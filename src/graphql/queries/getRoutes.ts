import { gql } from '@apollo/client';

export const GET_ROUTES = gql`
  query GetRoutes(
    $outgoing: String!
    $incoming: String!
    $tokens: Int!
    $maxFee: Int
  ) {
    getRoutes(
      outgoing: $outgoing
      incoming: $incoming
      tokens: $tokens
      maxFee: $maxFee
    ) {
      confidence
      fee
      fee_mtokens
      hops {
        channel
        channel_capacity
        fee
        fee_mtokens
        forward
        forward_mtokens
        public_key
        timeout
      }
      mtokens
      safe_fee
      safe_tokens
      timeout
      tokens
    }
  }
`;
