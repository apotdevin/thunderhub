import { gql } from '@apollo/client';

export const GET_BASE_INFO = gql`
  query GetBaseInfo {
    getBaseInfo {
      lastBosUpdate
      apiTokenSatPrice
      apiTokenOriginalSatPrice
    }
  }
`;
