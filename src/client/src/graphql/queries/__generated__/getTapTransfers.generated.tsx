import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapTransfersQueryVariables = { [key: string]: never };

export type GetTapTransfersQuery = {
  __typename?: 'Query';
  getTapTransfers: {
    __typename?: 'TapTransferList';
    transfers: {
      __typename?: 'TapTransfer';
      anchorTxHash?: string | null;
      anchorTxHeightHint?: number | null;
      anchorTxChainFees?: string | null;
      transferTimestamp?: string | null;
      label?: string | null;
      inputs?: {
        __typename?: 'TapTransferInput';
        anchorPoint?: string | null;
        assetId?: string | null;
        amount?: string | null;
      }[];
      outputs?: {
        __typename?: 'TapTransferOutput';
        assetId?: string | null;
        amount?: string | null;
        scriptKeyIsLocal?: boolean | null;
        outputType?: string | null;
      }[];
    }[];
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
