import gql from 'graphql-tag';

export const GET_LIQUID_REPORT = gql`
  query GetLiquidReport($auth: authType!) {
    getChannelReport(auth: $auth) {
      local
      remote
      maxIn
      maxOut
    }
  }
`;
