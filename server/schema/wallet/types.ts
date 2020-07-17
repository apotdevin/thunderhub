import { gql } from 'apollo-server-micro';

export const walletTypes = gql`
  type walletInfoType {
    build_tags: [String!]!
    commit_hash: String!
    is_autopilotrpc_enabled: Boolean!
    is_chainrpc_enabled: Boolean!
    is_invoicesrpc_enabled: Boolean!
    is_signrpc_enabled: Boolean!
    is_walletrpc_enabled: Boolean!
    is_watchtowerrpc_enabled: Boolean!
    is_wtclientrpc_enabled: Boolean!
  }
`;
