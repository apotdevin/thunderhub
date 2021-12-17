import { gql } from '@apollo/client';

export const GET_BITCOIN_PRICE = gql`
  query GetBitcoinPrice {
    getBitcoinPrice
  }
`;
