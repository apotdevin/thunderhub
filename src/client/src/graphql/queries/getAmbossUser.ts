import { gql } from '@apollo/client';

export const GET_AMBOSS_USER = gql`
  query GetAmbossUser {
    getAmbossUser {
      subscription {
        end_date
        subscribed
        upgradable
      }
    }
  }
`;
