import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type FundTapAssetChannelMutationVariables = {
  peerPubkey: string;
  assetAmount: number;
  groupKey?: string | null;
  assetId?: string | null;
  feeRateSatPerVbyte?: number | null;
  pushSat?: number | null;
};

export type FundTapAssetChannelMutation = {
  __typename?: 'Mutation';
  fundTapAssetChannel: {
    __typename?: 'TapFundChannelResponse';
    txid?: string | null;
    outputIndex?: number | null;
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
