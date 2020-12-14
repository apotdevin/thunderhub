import { gql } from '@apollo/client';

export const DELETE_BASE_TOKEN = gql`
  mutation DeleteBaseToken {
    deleteBaseToken
  }
`;
