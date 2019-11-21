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
    getChainBalance
    getPendingChainBalance
    getChannelBalance {
      confirmedBalance
      pendingBalance
    }
  }
`;

export const GET_CHANNELS = gql`
  query GetChannels {
    getChannels {
      capacity
      commitTransactionFee
      commitTransactionWeight
      id
      isActive
      isClosing
      isOpening
      isPartnerInitiated
      isPrivate
      isStaticRemoteKey
      localBalance
      localReserve
      partnerPublicKey
      received
      remoteBalance
      remoteReserve
      sent
      timeOffline
      timeOnline
      transactionId
      transactionVout
      unsettledBalance
      partnerNodeInfo {
        alias
        capacity
        channelCount
        color
        lastUpdate
      }
    }
  }
`;

export const GET_PENDING_CHANNELS = gql`
  query GetPendingChannels {
    getPendingChannels {
      isActive
      isClosing
      isOpening
      localBalance
      localReserve
      partnerPublicKey
      received
      remoteBalance
      remoteReserve
      sent
      partnerNodeInfo {
        alias
        capacity
        channelCount
        color
        lastUpdate
      }
    }
  }
`;

export const GET_INVOICES = gql`
  query GetInvoices {
    getInvoices {
      chainAddress
      confirmedAt
      createdAt
      description
      descriptionHash
      expiresAt
      id
      isCanceled
      isConfirmed
      isHeld
      isOutgoing
      isPrivate
      payments {
        confirmedAt
        createdAt
        createdHeight
        inChannel
        isCanceled
        isConfirmed
        isHeld
        mtokens
        pendingIndex
        tokens
      }
      received
      receivedMtokens
      request
      secret
      tokens
    }
  }
`;

export const GET_BITCOIN_PRICE = gql`
  query GetBitcoinPrice($currency: String) {
    getBitcoinPrice(currency: $currency) {
      price
      symbol
    }
  }
`;
