import { gql } from '@apollo/client';

export const GET_BITCOIN_BLOCK_HEIGHT = gql`
  query GetBitcoinBlockHeight {
    getCurrentBlockHeight
  }
`;
