import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreatePeerSwapSwapMutationVariables = Types.Exact<{
  amount: Types.Scalars['Float'];
  asset: Types.Scalars['String'];
  channelId: Types.Scalars['String'];
  type: Types.Scalars['String'];
}>;

export type CreatePeerSwapSwapMutation = {
  __typename?: 'Mutation';
  createPeerSwapSwap: {
    __typename?: 'GetPeerSwapSwapType';
    swap: {
      __typename?: 'PeerSwapSwapType';
      id: string;
      createdAt: string;
      asset: string;
      type: string;
      role: string;
      state: string;
      initiatorNodeId: string;
      peerNodeId: string;
      amount: string;
      channelId: string;
      openingTxId: string;
      claimTxId: string;
      cancelMessage: string;
      lndChanId: string;
    };
  };
};

export const CreatePeerSwapSwapDocument = gql`
  mutation CreatePeerSwapSwap(
    $amount: Float!
    $asset: String!
    $channelId: String!
    $type: String!
  ) {
    createPeerSwapSwap(
      amount: $amount
      asset: $asset
      channelId: $channelId
      type: $type
    ) {
      swap {
        id
        createdAt
        asset
        type
        role
        state
        initiatorNodeId
        peerNodeId
        amount
        channelId
        openingTxId
        claimTxId
        cancelMessage
        lndChanId
      }
    }
  }
`;
export type CreatePeerSwapSwapMutationFn = Apollo.MutationFunction<
  CreatePeerSwapSwapMutation,
  CreatePeerSwapSwapMutationVariables
>;

/**
 * __useCreatePeerSwapSwapMutation__
 *
 * To run a mutation, you first call `useCreatePeerSwapSwapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePeerSwapSwapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPeerSwapSwapMutation, { data, loading, error }] = useCreatePeerSwapSwapMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      asset: // value for 'asset'
 *      channelId: // value for 'channelId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreatePeerSwapSwapMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePeerSwapSwapMutation,
    CreatePeerSwapSwapMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreatePeerSwapSwapMutation,
    CreatePeerSwapSwapMutationVariables
  >(CreatePeerSwapSwapDocument, options);
}
export type CreatePeerSwapSwapMutationHookResult = ReturnType<
  typeof useCreatePeerSwapSwapMutation
>;
export type CreatePeerSwapSwapMutationResult =
  Apollo.MutationResult<CreatePeerSwapSwapMutation>;
export type CreatePeerSwapSwapMutationOptions = Apollo.BaseMutationOptions<
  CreatePeerSwapSwapMutation,
  CreatePeerSwapSwapMutationVariables
>;
