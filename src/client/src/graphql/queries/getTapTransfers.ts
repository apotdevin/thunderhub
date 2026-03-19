import { gql } from '@apollo/client';

export const GET_TAP_TRANSFERS = gql`
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
