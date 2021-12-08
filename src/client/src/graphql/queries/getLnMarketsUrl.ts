import { gql } from '@apollo/client';

export const GET_LN_MARKETS_URL = gql`
  query GetLnMarketsUrl {
    getLnMarketsUrl
  }
`;
