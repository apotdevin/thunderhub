import { gql } from '@apollo/client';

export const GET_PEER_SWAP_SWAPS = gql`
  query GetPeerSwapSwaps {
    getPeerSwapSwaps {
      swaps {
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
