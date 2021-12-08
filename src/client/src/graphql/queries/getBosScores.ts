import { gql } from '@apollo/client';

export const GET_BOS_SCORES = gql`
  query GetBosScores {
    getBosScores {
      alias
      public_key
      score
      updated
      position
    }
  }
`;
