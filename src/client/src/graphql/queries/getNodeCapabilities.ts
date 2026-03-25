import { gql } from '@apollo/client';

export const GET_NODE_CAPABILITIES = gql`
  query GetNodeCapabilities {
    getNodeCapabilities {
      capabilities
    }
  }
`;
