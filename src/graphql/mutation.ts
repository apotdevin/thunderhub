import gql from "graphql-tag";

export const CLOSE_CHANNEL = gql`
  mutation CloseChannel(
    $id: String!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;

export const PAY_INVOICE = gql`
  mutation PayInvoice($request: String!) {
    pay(request: $request) {
      isConfirmed
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation PayInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
    }
  }
`;
