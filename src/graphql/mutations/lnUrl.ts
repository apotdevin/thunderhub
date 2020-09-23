import { gql } from '@apollo/client';

export const FETCH_LN_URL = gql`
  mutation FetchLnUrl($url: String!) {
    fetchLnUrl(url: $url) {
      ... on WithdrawRequest {
        callback
        k1
        maxWithdrawable
        defaultDescription
        minWithdrawable
        tag
      }
      ... on PayRequest {
        callback
        maxSendable
        minSendable
        metadata
        commentAllowed
        tag
      }
    }
  }
`;

export const PAY_LN_URL = gql`
  mutation PayLnUrl($callback: String!, $amount: Int!, $comment: String) {
    lnUrlPay(callback: $callback, amount: $amount, comment: $comment) {
      tag
      description
      url
      message
      ciphertext
      iv
    }
  }
`;

export const WITHDRAW_LN_URL = gql`
  mutation WithdrawLnUrl(
    $callback: String!
    $amount: Int!
    $k1: String!
    $description: String
  ) {
    lnUrlWithdraw(
      callback: $callback
      amount: $amount
      k1: $k1
      description: $description
    )
  }
`;
