import { gql } from '@apollo/client';

export const GET_FEE_HEALTH = gql`
  query GetFeeHealth {
    getFeeHealth {
      score
      channels {
        id
        partnerSide {
          score
          rate
          base
          rateScore
          baseScore
          rateOver
          baseOver
        }
        mySide {
          score
          rate
          base
          rateScore
          baseScore
          rateOver
          baseOver
        }
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;
