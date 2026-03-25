import { gql } from '@apollo/client';

export const GET_TAP_ASSETS = gql`
  query GetTapAssets {
    getTapAssets {
      assets {
        assetGenesis {
          genesisPoint
          name
          metaHash
          assetId
          assetType
          outputIndex
        }
        amount
        lockTime
        relativeLockTime
        scriptVersion
        scriptKey
        isSpent
        isBurn
      }
    }
  }
`;
