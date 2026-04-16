import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SendTapAssetMutationVariables = Types.Exact<{
  tap_addrs:
    | Array<Types.Scalars['String']['input']>
    | Types.Scalars['String']['input'];
}>;

export type SendTapAssetMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    send_asset: boolean;
  };
};

export const SendTapAssetDocument = gql`
  mutation SendTapAsset($tap_addrs: [String!]!) {
    taproot_assets {
      send_asset(tap_addrs: $tap_addrs)
    }
  }
`;
export type SendTapAssetMutationFn = Apollo.MutationFunction<
  SendTapAssetMutation,
  SendTapAssetMutationVariables
>;

/**
 * __useSendTapAssetMutation__
 *
 * To run a mutation, you first call `useSendTapAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTapAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTapAssetMutation, { data, loading, error }] = useSendTapAssetMutation({
 *   variables: {
 *      tap_addrs: // value for 'tap_addrs'
 *   },
 * });
 */
export function useSendTapAssetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendTapAssetMutation,
    SendTapAssetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SendTapAssetMutation,
    SendTapAssetMutationVariables
  >(SendTapAssetDocument, options);
}
export type SendTapAssetMutationHookResult = ReturnType<
  typeof useSendTapAssetMutation
>;
export type SendTapAssetMutationResult =
  Apollo.MutationResult<SendTapAssetMutation>;
export type SendTapAssetMutationOptions = Apollo.BaseMutationOptions<
  SendTapAssetMutation,
  SendTapAssetMutationVariables
>;
