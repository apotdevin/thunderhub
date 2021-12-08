import { gql } from '@apollo/client';

export const GET_BOLTZ_INFO = gql`
  mutation CreateBoltzReverseSwap($amount: Float!, $address: String) {
    createBoltzReverseSwap(amount: $amount, address: $address) {
      id
      invoice
      redeemScript
      onchainAmount
      timeoutBlockHeight
      lockupAddress
      minerFeeInvoice
      receivingAddress
      preimage
      preimageHash
      privateKey
      publicKey
      decodedInvoice {
        description
        destination
        expires_at
        id
        safe_tokens
        tokens
        destination_node {
          node {
            alias
          }
        }
      }
    }
  }
`;
