import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapTransfersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapTransfersQuery = {
  __typename?: 'Query';
  taproot_assets: {
    __typename?: 'TaprootAssetsQueries';
    id: string;
    get_transfers: {
      __typename?: 'TapTransferList';
      transfers: Array<{
        __typename?: 'TapTransfer';
        anchor_tx_hash: string;
        anchor_tx_height_hint: number;
        anchor_tx_chain_fees: string;
        transfer_timestamp: string;
        label: string;
        inputs: Array<{
          __typename?: 'TapTransferInput';
          anchor_point: string;
          asset_id: string;
          amount: string;
        }>;
        outputs: Array<{
          __typename?: 'TapTransferOutput';
          asset_id: string;
          amount: string;
          script_key_is_local: boolean;
          output_type: string;
        }>;
      }>;
    };
  };
};

export const GetTapTransfersDocument = gql`
  query GetTapTransfers {
    taproot_assets {
      id
      get_transfers {
        transfers {
          anchor_tx_hash
          anchor_tx_height_hint
          anchor_tx_chain_fees
          transfer_timestamp
          label
          inputs {
            anchor_point
            asset_id
            amount
          }
          outputs {
            asset_id
            amount
            script_key_is_local
            output_type
          }
        }
      }
    }
  }
`;

/**
 * __useGetTapTransfersQuery__
 *
 * To run a query within a React component, call `useGetTapTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapTransfersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapTransfersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapTransfersQuery,
    GetTapTransfersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapTransfersQuery, GetTapTransfersQueryVariables>(
    GetTapTransfersDocument,
    options
  );
}
export function useGetTapTransfersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapTransfersQuery,
    GetTapTransfersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTapTransfersQuery,
    GetTapTransfersQueryVariables
  >(GetTapTransfersDocument, options);
}
// @ts-ignore
export function useGetTapTransfersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapTransfersQuery,
    GetTapTransfersQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapTransfersQuery,
  GetTapTransfersQueryVariables
>;
export function useGetTapTransfersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapTransfersQuery,
        GetTapTransfersQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapTransfersQuery | undefined,
  GetTapTransfersQueryVariables
>;
export function useGetTapTransfersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapTransfersQuery,
        GetTapTransfersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapTransfersQuery,
    GetTapTransfersQueryVariables
  >(GetTapTransfersDocument, options);
}
export type GetTapTransfersQueryHookResult = ReturnType<
  typeof useGetTapTransfersQuery
>;
export type GetTapTransfersLazyQueryHookResult = ReturnType<
  typeof useGetTapTransfersLazyQuery
>;
export type GetTapTransfersSuspenseQueryHookResult = ReturnType<
  typeof useGetTapTransfersSuspenseQuery
>;
export type GetTapTransfersQueryResult = Apollo.QueryResult<
  GetTapTransfersQuery,
  GetTapTransfersQueryVariables
>;
