import { gql } from '@apollo/client';

export const GET_AMBOSS_USER = gql`
  query GetAmbossUser {
    getAmbossUser {
      subscription {
        end_date
        subscribed
        upgradable
      }
      backups {
        last_update
        last_update_size
        total_size_saved
        available_size
        remaining_size
      }
      ghost {
        username
      }
    }
  }
`;
