import { gql } from '@apollo/client';

export const GET_TAP_UNIVERSE_ASSETS = gql`
  query GetTapUniverseAssets {
    getTapUniverseAssets {
      assets {
        name
        assetId
        groupKey
        totalSupply
      }
    }
  }
`;
