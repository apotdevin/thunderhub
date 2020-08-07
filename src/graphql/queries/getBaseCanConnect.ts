import { gql } from '@apollo/client';

export const GET_BASE_CAN_CONNECT = gql`
  query GetBaseCanConnect {
    getBaseCanConnect
  }
`;
