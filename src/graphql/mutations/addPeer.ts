import { gql } from '@apollo/client';

export const ADD_PEER = gql`
  mutation AddPeer(
    $url: String
    $publicKey: String
    $socket: String
    $isTemporary: Boolean
  ) {
    addPeer(
      url: $url
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
