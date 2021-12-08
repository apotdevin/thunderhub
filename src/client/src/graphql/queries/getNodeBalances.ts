import { gql } from '@apollo/client';

export const GET_NODE_BALANCES = gql`
  query GetNodeBalances {
    getNodeBalances {
      onchain {
        confirmed
        pending
        closing
      }
      lightning {
        confirmed
        active
        commit
        pending
      }
    }
  }
`;
