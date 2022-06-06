import { gql } from '@apollo/client';

export const CREATE_INVOICE = gql`
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
      id
      createdAt
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
    }
  }
`;
