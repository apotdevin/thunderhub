import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapSupportedAssetsQueryVariables = { [key: string]: never };

export type GetTapSupportedAssetsQuery = {
  __typename?: 'Query';
  getTapSupportedAssets: {
    __typename?: 'TapSupportedAssetList';
    totalCount: number;
    list: {
      __typename?: 'TapSupportedAsset';
      id: string;
      symbol?: string | null;
      description?: string | null;
      precision?: number | null;
      assetId?: string | null;
      groupKey?: string | null;
    }[];
  };
};

export const GetTapSupportedAssetsDocument = gql`
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

export function useGetTapSupportedAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >(GetTapSupportedAssetsDocument, options);
}
