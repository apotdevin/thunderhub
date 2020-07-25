import gql from 'graphql-tag';

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($nested: Boolean) {
    createAddress(nested: $nested)
  }
`;
