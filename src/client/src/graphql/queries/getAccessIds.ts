import { gql } from '@apollo/client';

export const GET_ACCESS_IDS = gql`
  query GetAccessIds {
    lightning {
      get_access_ids {
        ids
      }
    }
  }
`;
