import { gql } from '@apollo/client';

export const OPEN_CHANNEL = gql`
  mutation OpenChannel($input: OpenChannelParams!) {
    openChannel(input: $input) {
      transactionId
      transactionOutputIndex
    }
  }
`;
