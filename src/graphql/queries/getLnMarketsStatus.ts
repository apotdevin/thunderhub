import { gql } from '@apollo/client';

export const GET_LN_MARKETS_STATUS = gql`
  query GetLnMarketsStatus {
    getLnMarketsStatus
  }
`;
