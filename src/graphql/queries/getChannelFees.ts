import gql from 'graphql-tag';

export const CHANNEL_FEES = gql`
  query ChannelFees($auth: authType!) {
    getChannelFees(auth: $auth) {
      alias
      color
      baseFee
      feeRate
      transactionId
      transactionVout
      public_key
    }
  }
`;
