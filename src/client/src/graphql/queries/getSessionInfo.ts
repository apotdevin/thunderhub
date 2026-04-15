import { gql } from '@apollo/client';

export const GET_SESSION_INFO = gql`
  query GetSessionInfo {
    public {
      id
      get_session_info {
        loggedIn
        type
        name
        slug
      }
    }
  }
`;
