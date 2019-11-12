import gql from "graphql-tag";

export const GET_NETWORK_INFO = gql`
  query GetNetworkInfo {
    getNetworkInfo {
      averageChannelSize
      channelCount
      maxChannelSize
      medianChannelSize
      minChannelSize
      nodeCount
      notRecentlyUpdatedPolicyCount
      totalCapacity
    }
  }
`;

export const GET_NODE_INFO = gql`
  query GetNodeInfo {
    getNodeInfo {
      chains
      color
      activeChannelsCount
      currentBlockHash
      currentBlockHeight
      isSyncedToChain
      isSyncedToGraph
      latestBlockAt
      peersCount
      pendingChannelsCount
      publicKey
      uris
      version
      alias
    }
  }
`;

export const GET_WALLET_INFO = gql`
  query GetWalletInfo {
    getChainBalance
    getPendingChainBalance
    getChannelBalance {
      confirmedBalance
      pendingBalance
    }
  }
`;
