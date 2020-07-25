import { gql } from 'apollo-server-micro';

export const generalTypes = gql`
  input permissionsType {
    is_ok_to_adjust_peers: Boolean
    is_ok_to_create_chain_addresses: Boolean
    is_ok_to_create_invoices: Boolean
    is_ok_to_create_macaroons: Boolean
    is_ok_to_derive_keys: Boolean
    is_ok_to_get_chain_transactions: Boolean
    is_ok_to_get_invoices: Boolean
    is_ok_to_get_wallet_info: Boolean
    is_ok_to_get_payments: Boolean
    is_ok_to_get_peers: Boolean
    is_ok_to_pay: Boolean
    is_ok_to_send_to_chain_addresses: Boolean
    is_ok_to_sign_bytes: Boolean
    is_ok_to_sign_messages: Boolean
    is_ok_to_stop_daemon: Boolean
    is_ok_to_verify_bytes_signatures: Boolean
    is_ok_to_verify_messages: Boolean
  }

  scalar Date
  scalar Time
  scalar DateTime
`;

export const queryTypes = gql`
  type Query {
    getBaseNodes: [baseNodesType]!
    getAccountingReport(
      category: String
      currency: String
      fiat: String
      month: String
      year: String
    ): String!
    getVolumeHealth: channelsHealth
    getTimeHealth: channelsTimeHealth
    getFeeHealth: channelsFeeHealth
    getChannelBalance: channelBalanceType
    getChannels(active: Boolean): [channelType]!
    getClosedChannels(type: String): [closedChannelType]
    getPendingChannels: [pendingChannelType]
    getChannelFees: [channelFeeType]
    getChannelReport: channelReportType
    getNetworkInfo: networkInfoType
    getNodeInfo: nodeInfoType
    adminCheck: Boolean
    getNode(publicKey: String!, withoutChannels: Boolean): Node!
    decodeRequest(request: String!): decodeType
    getWalletInfo: walletInfoType
    getResume(token: String): getResumeType
    getForwards(time: String): getForwardType
    getBitcoinPrice(logger: Boolean, currency: String): String
    getBitcoinFees(logger: Boolean): bitcoinFeeType
    getForwardReport(time: String): String
    getForwardChannelsReport(time: String, order: String, type: String): String
    getInOut(time: String): InOutType
    getBackups: String
    verifyBackups(backup: String!): Boolean
    recoverFunds(backup: String!): Boolean
    getRoutes(
      outgoing: String!
      incoming: String!
      tokens: Int!
      maxFee: Int
    ): GetRouteType
    getPeers: [peerType]
    signMessage(message: String!): String
    verifyMessage(message: String!, signature: String!): String
    getChainBalance: Int
    getPendingChainBalance: Int
    getChainTransactions: [getTransactionsType]
    getUtxos: [getUtxosType]
    getOffers(filter: String): [hodlOfferType]
    getCountries: [hodlCountryType]
    getCurrencies: [hodlCurrencyType]
    getMessages(
      token: String
      initialize: Boolean
      lastMessage: String
    ): getMessagesType
    getAuthToken(cookie: String): Boolean
    getSessionToken(id: String, password: String): Boolean
    getServerAccounts: [serverAccountType]
    getLnPayInfo: lnPayInfoType
    getLnPay(amount: Int): String
    getLatestVersion: String
  }
`;

export const mutationTypes = gql`
  type Mutation {
    closeChannel(
      id: String!
      forceClose: Boolean
      targetConfirmations: Int
      tokensPerVByte: Int
    ): closeChannelType
    openChannel(
      amount: Int!
      partnerPublicKey: String!
      tokensPerVByte: Int
      isPrivate: Boolean
    ): openChannelType
    updateFees(
      transaction_id: String
      transaction_vout: Int
      base_fee_tokens: Float
      fee_rate: Int
      cltv_delta: Int
      max_htlc_mtokens: String
      min_htlc_mtokens: String
    ): Boolean
    keysend(destination: String!, tokens: Int!): payType
    createInvoice(amount: Int!): newInvoiceType
    circularRebalance(route: String!): Boolean
    bosRebalance(
      avoid: [String]
      in_through: String
      is_avoiding_high_inbound: Boolean
      max_fee: Int
      max_fee_rate: Int
      max_rebalance: Int
      node: String
      out_channels: [String]
      out_through: String
      target: Int
    ): bosRebalanceResultType
    payViaRoute(route: String!, id: String!): Boolean
    createAddress(nested: Boolean): String
    sendToAddress(
      address: String!
      tokens: Int
      fee: Int
      target: Int
      sendAll: Boolean
    ): sendToType
    addPeer(
      url: String
      publicKey: String
      socket: String
      isTemporary: Boolean
    ): Boolean
    removePeer(publicKey: String!): Boolean
    sendMessage(
      publicKey: String!
      message: String!
      messageType: String
      tokens: Int
      maxFee: Int
    ): Int
    logout(type: String!): Boolean
    createMacaroon(permissions: permissionsType!): String
  }
`;
