import { gql } from '@apollo/client';

export const GET_AMBOSS_LOGIN_TOKEN = gql`
  query GetAmbossLoginToken {
    getAmbossLoginToken
  }
`;
