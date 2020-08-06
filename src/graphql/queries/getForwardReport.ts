import { gql } from '@apollo/client';

export const GET_FORWARD_REPORT = gql`
  query GetForwardReport($time: String) {
    getForwardReport(time: $time)
  }
`;
