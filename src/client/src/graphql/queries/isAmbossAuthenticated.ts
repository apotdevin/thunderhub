import { gql } from '@apollo/client';

export const IS_AMBOSS_AUTHENTICATED = gql`
  query IsAmbossAuthenticated {
    isAmbossAuthenticated
  }
`;
