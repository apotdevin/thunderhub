import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type BurnTapAssetMutationVariables = {
  assetId: string;
  amount: number;
};

export type BurnTapAssetMutation = {
  __typename?: 'Mutation';
  burnTapAsset: boolean;
};

export const BurnTapAssetDocument = gql`
  mutation BurnTapAsset($assetId: String!, $amount: Int!) {
    burnTapAsset(assetId: $assetId, amount: $amount)
  }
`;

export function useBurnTapAssetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BurnTapAssetMutation,
    BurnTapAssetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BurnTapAssetMutation,
    BurnTapAssetMutationVariables
  >(BurnTapAssetDocument, options);
}
