import gql from 'graphql-tag';

export const GET_BASE_NODES = gql`
  query GetBaseNodes {
    getBaseNodes {
      _id
      name
      public_key
      socket
      image
      type
    }
  }
`;
