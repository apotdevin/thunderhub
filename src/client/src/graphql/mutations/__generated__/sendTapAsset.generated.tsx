import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type SendTapAssetMutationVariables = {
  tapAddrs: string[];
};

export type SendTapAssetMutation = {
  __typename?: 'Mutation';
  sendTapAsset: boolean;
};

export const SendTapAssetDocument = gql`
  mutation SendTapAsset($tapAddrs: [String!]!) {
    sendTapAsset(tapAddrs: $tapAddrs)
  }
`;

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
