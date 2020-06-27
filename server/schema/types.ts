import { gql } from 'apollo-server-micro';

export const generalTypes = gql`
  input authType {
    type: String!
    id: String
    host: String
    macaroon: String
    cert: String
  }

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
    getAccountingReport(
      auth: authType!
      category: String
      currency: String
      fiat: String
      month: String
      year: String
    ): String!
    getVolumeHealth(auth: authType!): channelsHealth
    getTimeHealth(auth: authType!): channelsTimeHealth
    getFeeHealth(auth: authType!): channelsFeeHealth
    getChannelBalance(auth: authType!): channelBalanceType
    getChannels(auth: authType!, active: Boolean): [channelType]
    getClosedChannels(auth: authType!, type: String): [closedChannelType]
    getPendingChannels(auth: authType!): [pendingChannelType]
    getChannelFees(auth: authType!): [channelFeeType]
    getChannelReport(auth: authType!): channelReportType
    getNetworkInfo(auth: authType!): networkInfoType
    getNodeInfo(auth: authType!): nodeInfoType
    adminCheck(auth: authType!): Boolean
    getNode(
      auth: authType!
      publicKey: String!
      withoutChannels: Boolean
    ): Node!
    decodeRequest(auth: authType!, request: String!): decodeType
    getWalletInfo(auth: authType!): walletInfoType
    getResume(auth: authType!, token: String): getResumeType
    getForwards(auth: authType!, time: String): getForwardType
    getBitcoinPrice(logger: Boolean, currency: String): String
    getBitcoinFees(logger: Boolean): bitcoinFeeType
    getForwardReport(auth: authType!, time: String): String
    getForwardChannelsReport(
      auth: authType!
      time: String
      order: String
      type: String
    ): String
    getInOut(auth: authType!, time: String): InOutType
    getBackups(auth: authType!): String
    verifyBackups(auth: authType!, backup: String!): Boolean
    recoverFunds(auth: authType!, backup: String!): Boolean
    getRoutes(
      auth: authType!
      outgoing: String!
      incoming: String!
      tokens: Int!
      maxFee: Int
    ): GetRouteType
    getPeers(auth: authType!): [peerType]
    signMessage(auth: authType!, message: String!): String
    verifyMessage(auth: authType!, message: String!, signature: String!): String
    getChainBalance(auth: authType!): Int
    getPendingChainBalance(auth: authType!): Int
    getChainTransactions(auth: authType!): [getTransactionsType]
    getUtxos(auth: authType!): [getUtxosType]
    getOffers(filter: String): [hodlOfferType]
    getCountries: [hodlCountryType]
    getCurrencies: [hodlCurrencyType]
    getMessages(
      auth: authType!
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
      auth: authType!
      id: String!
      forceClose: Boolean
      targetConfirmations: Int
      tokensPerVByte: Int
    ): closeChannelType
    openChannel(
      auth: authType!
      amount: Int!
      partnerPublicKey: String!
      tokensPerVByte: Int
      isPrivate: Boolean
    ): openChannelType
    updateFees(
      auth: authType!
      transaction_id: String
      transaction_vout: Int
      base_fee_tokens: Float
      fee_rate: Int
      cltv_delta: Int
      max_htlc_mtokens: String
      min_htlc_mtokens: String
    ): Boolean
    keysend(auth: authType!, destination: String!, tokens: Int!): payType
    createInvoice(auth: authType!, amount: Int!): newInvoiceType
    circularRebalance(auth: authType!, route: String!): Boolean
    bosRebalance(
      auth: authType!
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
    payViaRoute(auth: authType!, route: String!, id: String!): Boolean
    createAddress(auth: authType!, nested: Boolean): String
    sendToAddress(
      auth: authType!
      address: String!
      tokens: Int
      fee: Int
      target: Int
      sendAll: Boolean
    ): sendToType
    addPeer(
      auth: authType!
      publicKey: String!
      socket: String!
      isTemporary: Boolean
    ): Boolean
    removePeer(auth: authType!, publicKey: String!): Boolean
    sendMessage(
      auth: authType!
      publicKey: String!
      message: String!
      messageType: String
      tokens: Int
      maxFee: Int
    ): Int
    logout(type: String!): Boolean
    createMacaroon(auth: authType!, permissions: permissionsType!): String
  }
`;
