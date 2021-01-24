import { gql } from '@apollo/client';

export const GET_MULTI_SSO_TOKEN = gql`
  mutation GetMultiSSOToken($id: String!) {
    getMultiSSOToken(id: $id)
  }
`;
