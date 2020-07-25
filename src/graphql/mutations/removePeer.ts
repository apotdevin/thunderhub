import gql from 'graphql-tag';

export const REMOVE_PEER = gql`
  mutation RemovePeer($publicKey: String!) {
    removePeer(publicKey: $publicKey)
  }
`;
