import { gql } from '@apollo/client';

export const LN_MARKETS_LOGIN = gql`
  mutation LnMarketsLogin {
    lnMarketsLogin {
      status
      message
    }
  }
`;

export const LN_MARKETS_WITHDRAW = gql`
  mutation LnMarketsWithdraw($amount: Int!) {
    lnMarketsWithdraw(amount: $amount)
  }
`;

export const LN_MARKETS_DEPOSIT = gql`
  mutation LnMarketsDeposit($amount: Int!) {
    lnMarketsDeposit(amount: $amount)
  }
`;

export const LN_MARKETS_LOGOUT = gql`
  mutation LnMarketsLogout {
    lnMarketsLogout
  }
`;
