import { gql } from '@apollo/client';

export const GET_TAP_SUPPORTED_ASSETS = gql`
  query GetTapSupportedAssets {
    getTapSupportedAssets {
      list {
        id
        symbol
        description
        precision
        assetId
        groupKey
      }
      totalCount
    }
  }
`;
