import { gql } from '@apollo/client';

export const CREATE_BASE_TOKEN = gql`
  mutation CreateBaseToken($id: String!) {
    createBaseToken(id: $id)
  }
`;
