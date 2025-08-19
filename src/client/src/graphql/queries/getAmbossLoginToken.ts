import { gql } from '@apollo/client';

export const GET_AMBOSS_LOGIN_TOKEN = gql`
  query GetAmbossLoginToken($redirect_url: String) {
    getAmbossLoginToken(redirect_url: $redirect_url)
  }
`;
