import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapAssetsQueryVariables = { [key: string]: never };

export type TapAssetGenesis = {
  __typename?: 'TapAssetGenesis';
  genesisPoint?: string | null;
  name?: string | null;
  metaHash?: string | null;
  assetId?: string | null;
  assetType?: number | null;
  outputIndex?: number | null;
};

export type TapAssetItem = {
  __typename?: 'TapAsset';
  assetGenesis?: TapAssetGenesis | null;
  amount?: string | null;
  lockTime?: number | null;
  relativeLockTime?: number | null;
  scriptVersion?: number | null;
  scriptKey?: string | null;
  isSpent?: boolean | null;
  isBurn?: boolean | null;
};

export type GetTapAssetsQuery = {
  __typename?: 'Query';
  getTapAssets: {
    __typename?: 'TapAssetList';
    assets: TapAssetItem[];
  };
};

export const GetTapAssetsDocument = gql`
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

export function useGetTapAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapAssetsQuery,
    GetTapAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapAssetsQuery, GetTapAssetsQueryVariables>(
    GetTapAssetsDocument,
    options
  );
}

export function useGetTapAssetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapAssetsQuery,
    GetTapAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTapAssetsQuery, GetTapAssetsQueryVariables>(
    GetTapAssetsDocument,
    options
  );
}
