import { gql } from '@apollo/client';

export const GET_BITCOIN_FEES = gql`
  query GetBitcoinFees {
    getBitcoinFees {
      fast
      halfHour
      hour
      minimum
    }
  }
`;
