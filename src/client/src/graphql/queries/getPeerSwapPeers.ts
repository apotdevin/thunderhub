import { gql } from '@apollo/client';

export const GET_PEER_SWAP_PEERS = gql`
  query GetPeerSwapPeers {
    getPeerSwapPeers {
      peers {
        supportedAssets
        channels {
          channelId
          localBalance
          remoteBalance
          localPercentage
          active
        }
        nodeId
        swapsAllowed
        asSender {
          swapsOut
          swapsIn
          satsOut
          satsIn
        }
        asReceiver {
          swapsOut
          swapsIn
          satsOut
          satsIn
        }
        paidFee
      }
    }
  }
`;
