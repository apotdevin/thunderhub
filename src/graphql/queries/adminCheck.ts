import gql from 'graphql-tag';

export const GET_CAN_ADMIN = gql`
  query GetCanAdmin {
    adminCheck
  }
`;
