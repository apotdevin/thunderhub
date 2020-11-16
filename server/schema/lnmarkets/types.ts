import { gql } from '@apollo/client';

export const lnMarketsTypes = gql`
  type LnMarketsUserInfo {
    uid: String
    balance: String
    account_type: String
    username: String
    linkingpublickey: String
    last_ip: String
  }
`;
