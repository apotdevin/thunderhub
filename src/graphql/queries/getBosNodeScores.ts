import { gql } from '@apollo/client';

export const GET_BOS_NODE_SCORES = gql`
  query GetBosNodeScores($publicKey: String!) {
    getBosNodeScores(publicKey: $publicKey) {
      alias
      public_key
      score
      updated
      position
    }
  }
`;
