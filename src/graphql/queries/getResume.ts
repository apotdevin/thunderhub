import gql from 'graphql-tag';

export const GET_RESUME = gql`
  query GetResume($auth: authType!, $token: String) {
    getResume(auth: $auth, token: $token) {
      token
      resume
    }
  }
`;
