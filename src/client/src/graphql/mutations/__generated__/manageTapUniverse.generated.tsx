import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddTapFederationServerMutationVariables = Types.Exact<{
  host: Types.Scalars['String']['input'];
}>;

export type AddTapFederationServerMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    add_federation_server: boolean;
  };
};

export type RemoveTapFederationServerMutationVariables = Types.Exact<{
  host: Types.Scalars['String']['input'];
}>;

export type RemoveTapFederationServerMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    remove_federation_server: boolean;
  };
};

export type SyncTapUniverseMutationVariables = Types.Exact<{
  host: Types.Scalars['String']['input'];
}>;

export type SyncTapUniverseMutation = {
  __typename?: 'Mutation';
  taproot_assets: {
    __typename?: 'TaprootAssetsMutations';
    sync_universe: {
      __typename?: 'TapSyncResult';
      synced_universes: Array<string>;
    };
  };
};

export const AddTapFederationServerDocument = gql`
  mutation AddTapFederationServer($host: String!) {
    taproot_assets {
      add_federation_server(host: $host)
    }
  }
`;
export type AddTapFederationServerMutationFn = Apollo.MutationFunction<
  AddTapFederationServerMutation,
  AddTapFederationServerMutationVariables
>;

/**
 * __useAddTapFederationServerMutation__
 *
 * To run a mutation, you first call `useAddTapFederationServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTapFederationServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTapFederationServerMutation, { data, loading, error }] = useAddTapFederationServerMutation({
 *   variables: {
 *      host: // value for 'host'
 *   },
 * });
 */
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
export type AddTapFederationServerMutationHookResult = ReturnType<
  typeof useAddTapFederationServerMutation
>;
export type AddTapFederationServerMutationResult =
  Apollo.MutationResult<AddTapFederationServerMutation>;
export type AddTapFederationServerMutationOptions = Apollo.BaseMutationOptions<
  AddTapFederationServerMutation,
  AddTapFederationServerMutationVariables
>;
export const RemoveTapFederationServerDocument = gql`
  mutation RemoveTapFederationServer($host: String!) {
    taproot_assets {
      remove_federation_server(host: $host)
    }
  }
`;
export type RemoveTapFederationServerMutationFn = Apollo.MutationFunction<
  RemoveTapFederationServerMutation,
  RemoveTapFederationServerMutationVariables
>;

/**
 * __useRemoveTapFederationServerMutation__
 *
 * To run a mutation, you first call `useRemoveTapFederationServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTapFederationServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTapFederationServerMutation, { data, loading, error }] = useRemoveTapFederationServerMutation({
 *   variables: {
 *      host: // value for 'host'
 *   },
 * });
 */
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
export type RemoveTapFederationServerMutationHookResult = ReturnType<
  typeof useRemoveTapFederationServerMutation
>;
export type RemoveTapFederationServerMutationResult =
  Apollo.MutationResult<RemoveTapFederationServerMutation>;
export type RemoveTapFederationServerMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveTapFederationServerMutation,
    RemoveTapFederationServerMutationVariables
  >;
export const SyncTapUniverseDocument = gql`
  mutation SyncTapUniverse($host: String!) {
    taproot_assets {
      sync_universe(host: $host) {
        synced_universes
      }
    }
  }
`;
export type SyncTapUniverseMutationFn = Apollo.MutationFunction<
  SyncTapUniverseMutation,
  SyncTapUniverseMutationVariables
>;

/**
 * __useSyncTapUniverseMutation__
 *
 * To run a mutation, you first call `useSyncTapUniverseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncTapUniverseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncTapUniverseMutation, { data, loading, error }] = useSyncTapUniverseMutation({
 *   variables: {
 *      host: // value for 'host'
 *   },
 * });
 */
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
export type SyncTapUniverseMutationHookResult = ReturnType<
  typeof useSyncTapUniverseMutation
>;
export type SyncTapUniverseMutationResult =
  Apollo.MutationResult<SyncTapUniverseMutation>;
export type SyncTapUniverseMutationOptions = Apollo.BaseMutationOptions<
  SyncTapUniverseMutation,
  SyncTapUniverseMutationVariables
>;
