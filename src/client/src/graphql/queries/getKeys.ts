import { gql } from '@apollo/client';

export const GET_KEYS = gql`
  query Keys {
    getKeys {
      pubkey
      privkey
    }
  }
`;
