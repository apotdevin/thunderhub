import gql from 'graphql-tag';

export const GET_WALLET_INFO = gql`
  query GetWalletInfo {
    getWalletInfo {
      build_tags
      commit_hash
      is_autopilotrpc_enabled
      is_chainrpc_enabled
      is_invoicesrpc_enabled
      is_signrpc_enabled
      is_walletrpc_enabled
      is_watchtowerrpc_enabled
      is_wtclientrpc_enabled
    }
  }
`;
