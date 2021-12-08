import { gql } from '@apollo/client';

export const GET_LN_MARKETS_USER_INFO = gql`
  query GetLnMarketsUserInfo {
    getLnMarketsUserInfo {
      uid
      balance
      account_type
      username
      linkingpublickey
      last_ip
    }
  }
`;
