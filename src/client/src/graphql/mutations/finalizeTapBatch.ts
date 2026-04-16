import { gql } from '@apollo/client';

export const FINALIZE_TAP_BATCH = gql`
  mutation FinalizeTapBatch {
    taproot_assets {
      finalize_batch {
        batch_key
      }
    }
  }
`;
