import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapTransfersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapTransfersQuery = {
  __typename?: 'Query';
  getTapTransfers: {
    __typename?: 'TapTransferList';
    transfers: Array<{
      __typename?: 'TapTransfer';
      anchorTxHash: string;
      anchorTxHeightHint: number;
      anchorTxChainFees: string;
      transferTimestamp: string;
      label: string;
      inputs: Array<{
        __typename?: 'TapTransferInput';
        anchorPoint: string;
        assetId: string;
        amount: string;
      }>;
      outputs: Array<{
        __typename?: 'TapTransferOutput';
        assetId: string;
        amount: string;
        scriptKeyIsLocal: boolean;
        outputType: string;
      }>;
    }>;
  };
};

export const GetTapTransfersDocument = gql`
  query GetTapTransfers {
    getTapTransfers {
      transfers {
        anchorTxHash
        anchorTxHeightHint
        anchorTxChainFees
        transferTimestamp
        label
        inputs {
          anchorPoint
          assetId
          amount
        }
        outputs {
          assetId
          amount
          scriptKeyIsLocal
          outputType
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
