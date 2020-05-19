import gql from 'graphql-tag';

export const GET_CAN_ADMIN = gql`
  query GetCanAdmin($auth: authType!) {
    adminCheck(auth: $auth)
  }
`;
