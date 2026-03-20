import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

// ── Add Federation Server ──

export type AddTapFederationServerMutationVariables = { host: string };
export type AddTapFederationServerMutation = {
  __typename?: 'Mutation';
  addTapFederationServer: boolean;
};

export const AddTapFederationServerDocument = gql`
  mutation AddTapFederationServer($host: String!) {
    addTapFederationServer(host: $host)
  }
`;

export function useAddTapFederationServerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddTapFederationServerMutation,
    AddTapFederationServerMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddTapFederationServerMutation,
    AddTapFederationServerMutationVariables
  >(AddTapFederationServerDocument, options);
}

// ── Remove Federation Server ──

export type RemoveTapFederationServerMutationVariables = { host: string };
export type RemoveTapFederationServerMutation = {
  __typename?: 'Mutation';
  removeTapFederationServer: boolean;
};

export const RemoveTapFederationServerDocument = gql`
  mutation RemoveTapFederationServer($host: String!) {
    removeTapFederationServer(host: $host)
  }
`;

export function useRemoveTapFederationServerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveTapFederationServerMutation,
    RemoveTapFederationServerMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveTapFederationServerMutation,
    RemoveTapFederationServerMutationVariables
  >(RemoveTapFederationServerDocument, options);
}

// ── Sync Universe ──

export type SyncTapUniverseMutationVariables = { host: string };
export type SyncTapUniverseMutation = {
  __typename?: 'Mutation';
  syncTapUniverse: {
    __typename?: 'TapSyncResult';
    syncedUniverses: string[];
  };
};

export const SyncTapUniverseDocument = gql`
  mutation SyncTapUniverse($host: String!) {
    syncTapUniverse(host: $host) {
      syncedUniverses
    }
  }
`;

export function useSyncTapUniverseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SyncTapUniverseMutation,
    SyncTapUniverseMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SyncTapUniverseMutation,
    SyncTapUniverseMutationVariables
  >(SyncTapUniverseDocument, options);
}
