import gql from 'graphql-tag';

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
