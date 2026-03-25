import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FundTapAssetChannelMutationVariables = Types.Exact<{
  peerPubkey: Types.Scalars['String']['input'];
  assetAmount: Types.Scalars['Int']['input'];
  groupKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
  assetId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  feeRateSatPerVbyte?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pushSat?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;

export type FundTapAssetChannelMutation = {
  __typename?: 'Mutation';
  fundTapAssetChannel: {
    __typename?: 'TapFundChannelResponse';
    txid: string;
    outputIndex: number;
  };
};

export const FundTapAssetChannelDocument = gql`
  mutation FundTapAssetChannel(
    $peerPubkey: String!
    $assetAmount: Int!
    $groupKey: String
    $assetId: String
    $feeRateSatPerVbyte: Int
    $pushSat: Int
  ) {
    fundTapAssetChannel(
      peerPubkey: $peerPubkey
      assetAmount: $assetAmount
      groupKey: $groupKey
      assetId: $assetId
      feeRateSatPerVbyte: $feeRateSatPerVbyte
      pushSat: $pushSat
    ) {
      txid
      outputIndex
    }
  }
`;
export type FundTapAssetChannelMutationFn = Apollo.MutationFunction<
  FundTapAssetChannelMutation,
  FundTapAssetChannelMutationVariables
>;

/**
 * __useFundTapAssetChannelMutation__
 *
 * To run a mutation, you first call `useFundTapAssetChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFundTapAssetChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fundTapAssetChannelMutation, { data, loading, error }] = useFundTapAssetChannelMutation({
 *   variables: {
 *      peerPubkey: // value for 'peerPubkey'
 *      assetAmount: // value for 'assetAmount'
 *      groupKey: // value for 'groupKey'
 *      assetId: // value for 'assetId'
 *      feeRateSatPerVbyte: // value for 'feeRateSatPerVbyte'
 *      pushSat: // value for 'pushSat'
 *   },
 * });
 */
export function useFundTapAssetChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FundTapAssetChannelMutation,
    FundTapAssetChannelMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    FundTapAssetChannelMutation,
    FundTapAssetChannelMutationVariables
  >(FundTapAssetChannelDocument, options);
}
export type FundTapAssetChannelMutationHookResult = ReturnType<
  typeof useFundTapAssetChannelMutation
>;
export type FundTapAssetChannelMutationResult =
  Apollo.MutationResult<FundTapAssetChannelMutation>;
export type FundTapAssetChannelMutationOptions = Apollo.BaseMutationOptions<
  FundTapAssetChannelMutation,
  FundTapAssetChannelMutationVariables
>;
