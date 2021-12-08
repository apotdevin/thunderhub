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
      ... on ChannelRequest {
        tag
        k1
        callback
        uri
      }
    }
  }
`;

export const AUTH_LN_URL = gql`
  mutation AuthLnUrl($url: String!) {
    lnUrlAuth(url: $url) {
      status
      message
    }
  }
`;

export const PAY_LN_URL = gql`
  mutation PayLnUrl($callback: String!, $amount: Float!, $comment: String) {
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
    $amount: Float!
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

export const CHANNEL_LN_URL = gql`
  mutation ChannelLnUrl($callback: String!, $k1: String!, $uri: String!) {
    lnUrlChannel(callback: $callback, k1: $k1, uri: $uri)
  }
`;
