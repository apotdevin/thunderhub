import gql from 'graphql-tag';

export const ADD_PEER = gql`
  mutation AddPeer(
    $auth: authType!
    $url: String
    $publicKey: String
    $socket: String
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      url: $url
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
