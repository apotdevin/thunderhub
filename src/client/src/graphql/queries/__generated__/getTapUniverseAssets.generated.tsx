import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapUniverseAssetsQueryVariables = { [key: string]: never };

export type GetTapUniverseAssetsQuery = {
  __typename?: 'Query';
  getTapUniverseAssets: {
    __typename?: 'TapUniverseAssetList';
    assets: {
      __typename?: 'TapUniverseAsset';
      name?: string | null;
      assetId?: string | null;
      groupKey?: string | null;
      totalSupply?: string | null;
    }[];
  };
};

export const GetTapUniverseAssetsDocument = gql`
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

export function useGetTapUniverseAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >(GetTapUniverseAssetsDocument, options);
}
