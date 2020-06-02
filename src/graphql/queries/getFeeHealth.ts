import { gql } from 'apollo-server-micro';

export const GET_FEE_HEALTH = gql`
  query GetFeeHealth($auth: authType!) {
    getFeeHealth(auth: $auth) {
      score
      channels {
        id
        myScore
        partnerScore
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;
