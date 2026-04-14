import { gql } from '@apollo/client';

export const LOGOUT_AMBOSS = gql`
  mutation LogoutAmboss {
    logoutAmboss
  }
`;
