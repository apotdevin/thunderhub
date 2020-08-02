import { gql } from '@apollo/client';

export const GET_LIQUID_REPORT = gql`
  query GetLiquidReport {
    getChannelReport {
      local
      remote
      maxIn
      maxOut
      commit
    }
  }
`;
