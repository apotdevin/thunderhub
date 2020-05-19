import gql from 'graphql-tag';

export const GET_BITCOIN_PRICE = gql`
  query GetBitcoinPrice {
    getBitcoinPrice
  }
`;
