import gql from 'graphql-tag';

export const GET_BITCOIN_FEES = gql`
  query GetBitcoinFees {
    getBitcoinFees {
      fast
      halfHour
      hour
    }
  }
`;
