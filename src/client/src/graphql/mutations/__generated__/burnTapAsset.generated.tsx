import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BurnTapAssetMutationVariables = Types.Exact<{
  asset_id: Types.Scalars['String']['input'];
  amount: Types.Scalars['String']['input'];
}>;

export type BurnTapAssetMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    burn_asset: boolean;
  };
};

export const BurnTapAssetDocument = gql`
  mutation BurnTapAsset($asset_id: String!, $amount: String!) {
    taproot_assets {
      burn_asset(asset_id: $asset_id, amount: $amount)
    }
  }
`;
export type BurnTapAssetMutationFn = Apollo.MutationFunction<
  BurnTapAssetMutation,
  BurnTapAssetMutationVariables
>;

/**
 * __useBurnTapAssetMutation__
 *
 * To run a mutation, you first call `useBurnTapAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBurnTapAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [burnTapAssetMutation, { data, loading, error }] = useBurnTapAssetMutation({
 *   variables: {
 *      asset_id: // value for 'asset_id'
 *      amount: // value for 'amount'
 *   },
 * });
 */
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
export type BurnTapAssetMutationHookResult = ReturnType<
  typeof useBurnTapAssetMutation
>;
export type BurnTapAssetMutationResult =
  Apollo.MutationResult<BurnTapAssetMutation>;
export type BurnTapAssetMutationOptions = Apollo.BaseMutationOptions<
  BurnTapAssetMutation,
  BurnTapAssetMutationVariables
>;
