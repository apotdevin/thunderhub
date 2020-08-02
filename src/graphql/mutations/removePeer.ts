import { gql } from '@apollo/client';

export const REMOVE_PEER = gql`
  mutation RemovePeer($publicKey: String!) {
    removePeer(publicKey: $publicKey)
  }
`;
