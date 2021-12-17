import { gql } from '@apollo/client';

export const GET_NODE_BOS_HISTORY = gql`
  query GetNodeBosHistory($pubkey: String!) {
    getNodeBosHistory(pubkey: $pubkey) {
      info {
        count
        first {
          position
          score
          updated
        }
        last {
          position
          score
          updated
        }
      }
      scores {
        position
        score
        updated
      }
    }
  }
`;
