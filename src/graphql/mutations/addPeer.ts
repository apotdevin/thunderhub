import gql from 'graphql-tag';

export const ADD_PEER = gql`
  mutation AddPeer(
    $auth: authType!
    $publicKey: String!
    $socket: String!
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
