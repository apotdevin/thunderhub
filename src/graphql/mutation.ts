import gql from 'graphql-tag';

export const CLOSE_CHANNEL = gql`
  mutation CloseChannel(
    $id: String!
    $auth: authType!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
      auth: $auth
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;

export const OPEN_CHANNEL = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $auth: authType!
    $tokensPerVByte: Int
    $isPrivate: Boolean
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      auth: $auth
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;

export const PAY_INVOICE = gql`
  mutation PayInvoice($request: String!, $auth: authType!, $tokens: Int) {
    pay(request: $request, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($amount: Int!, $auth: authType!) {
    createInvoice(amount: $amount, auth: $auth) {
      request
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($nested: Boolean, $auth: authType!) {
    createAddress(nested: $nested, auth: $auth)
  }
`;

export const PAY_ADDRESS = gql`
  mutation PayAddress(
    $auth: authType!
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
    $sendAll: Boolean
  ) {
    sendToAddress(
      auth: $auth
      address: $address
      tokens: $tokens
      fee: $fee
      target: $target
      sendAll: $sendAll
    ) {
      confirmationCount
      id
      isConfirmed
      isOutgoing
      tokens
    }
  }
`;

export const UPDATE_FEES = gql`
  mutation UpdateFees(
    $auth: authType!
    $transactionId: String
    $transactionVout: Int
    $baseFee: Int
    $feeRate: Int
  ) {
    updateFees(
      auth: $auth
      transactionId: $transactionId
      transactionVout: $transactionVout
      baseFee: $baseFee
      feeRate: $feeRate
    )
  }
`;

export const PAY_VIA_ROUTE = gql`
  mutation PayViaRoute($auth: authType!, $route: String!) {
    payViaRoute(auth: $auth, route: $route)
  }
`;

export const REMOVE_PEER = gql`
  mutation RemovePeer($auth: authType!, $publicKey: String!) {
    removePeer(auth: $auth, publicKey: $publicKey)
  }
`;

export const ADD_PEER = gql`
  mutation AddPeer(
    $auth: authType!
    $publicKey: String!
    $socket: String!
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $auth: authType!
    $publicKey: String!
    $message: String!
    $tokens: Int
  ) {
    sendMessage(
      auth: $auth
      publicKey: $publicKey
      message: $message
      tokens: $tokens
    )
  }
`;
