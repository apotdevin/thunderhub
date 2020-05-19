import gql from 'graphql-tag';

export const GET_FORWARD_REPORT = gql`
  query GetForwardReport($time: String, $auth: authType!) {
    getForwardReport(time: $time, auth: $auth)
  }
`;
