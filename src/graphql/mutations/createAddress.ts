import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($nested: Boolean) {
    createAddress(nested: $nested)
  }
`;
