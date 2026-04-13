import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MintTapAssetMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  amount: Types.Scalars['String']['input'];
  assetType?: Types.InputMaybe<Types.TapAssetType>;
  grouped?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  groupKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type MintTapAssetMutation = {
  __typename?: 'Mutation';
  mintTapAsset: { __typename?: 'TapMintResponse'; batchKey: string };
};

export const MintTapAssetDocument = gql`
  mutation MintTapAsset(
    $name: String!
    $amount: String!
    $assetType: TapAssetType
    $grouped: Boolean
    $groupKey: String
  ) {
    mintTapAsset(
      name: $name
      amount: $amount
      assetType: $assetType
      grouped: $grouped
      groupKey: $groupKey
    ) {
      batchKey
    }
  }
`;
export type MintTapAssetMutationFn = Apollo.MutationFunction<
  MintTapAssetMutation,
  MintTapAssetMutationVariables
>;

/**
 * __useMintTapAssetMutation__
 *
 * To run a mutation, you first call `useMintTapAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMintTapAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mintTapAssetMutation, { data, loading, error }] = useMintTapAssetMutation({
 *   variables: {
 *      name: // value for 'name'
 *      amount: // value for 'amount'
 *      assetType: // value for 'assetType'
 *      grouped: // value for 'grouped'
 *      groupKey: // value for 'groupKey'
 *   },
 * });
 */
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
export type MintTapAssetMutationHookResult = ReturnType<
  typeof useMintTapAssetMutation
>;
export type MintTapAssetMutationResult =
  Apollo.MutationResult<MintTapAssetMutation>;
export type MintTapAssetMutationOptions = Apollo.BaseMutationOptions<
  MintTapAssetMutation,
  MintTapAssetMutationVariables
>;
