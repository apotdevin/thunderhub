import { gql } from '@apollo/client';

export const FINALIZE_TAP_BATCH = gql`
  mutation FinalizeTapBatch {
    finalizeTapBatch {
      batchKey
    }
  }
`;
