import { gql } from 'apollo-server-micro';

export const generalTypes = gql`
  input authType {
    type: String!
    id: String
    host: String
    macaroon: String
    cert: String
  }

  # A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
  # date-time format outlined in section 5.6 of the RFC 3339 profile of the ISO
  # 8601 standard for representation of dates and times using the Gregorian calendar.
  scalar DateTime
`;

export const queryTypes = gql`
  type Query {
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
    ): nodeType
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
    ): String
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
      transactionId: String
      transactionVout: Int
      baseFee: Float
      feeRate: Int
    ): Boolean
    parsePayment(auth: authType!, request: String!): parsePaymentType
    pay(auth: authType!, request: String!, tokens: Int): payType
    createInvoice(auth: authType!, amount: Int!): newInvoiceType
    payViaRoute(auth: authType!, route: String!): Boolean
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
  }
`;
