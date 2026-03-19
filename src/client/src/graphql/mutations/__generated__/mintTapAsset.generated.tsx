import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type MintTapAssetMutationVariables = {
  name: string;
  amount: number;
  assetType?: string | null;
  groupKey?: string | null;
};

export type MintTapAssetMutation = {
  __typename?: 'Mutation';
  mintTapAsset: {
    __typename?: 'TapMintResponse';
    batchKey?: string | null;
  };
};

export const MintTapAssetDocument = gql`
  mutation MintTapAsset(
    $name: String!
    $amount: Int!
    $assetType: TapAssetType
    $groupKey: String
  ) {
    mintTapAsset(
      name: $name
      amount: $amount
      assetType: $assetType
      groupKey: $groupKey
    ) {
      batchKey
    }
  }
`;

export function useMintTapAssetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MintTapAssetMutation,
    MintTapAssetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MintTapAssetMutation,
    MintTapAssetMutationVariables
  >(MintTapAssetDocument, options);
}
