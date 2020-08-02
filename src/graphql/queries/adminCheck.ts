import { gql } from '@apollo/client';

export const GET_CAN_ADMIN = gql`
  query GetCanAdmin {
    adminCheck
  }
`;
