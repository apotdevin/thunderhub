import { gql } from 'apollo-server-micro';

export const GET_FEE_HEALTH = gql`
  query GetFeeHealth($auth: authType!) {
    getFeeHealth(auth: $auth) {
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
