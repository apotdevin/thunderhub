import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($type: String) {
    createAddress(type: $type)
  }
`;
