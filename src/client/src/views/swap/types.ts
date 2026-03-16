import { CreateBoltzReverseSwapType, DecodeInvoice } from '../../graphql/types';

export type CreateBoltzReverseSwap = Pick<
  CreateBoltzReverseSwapType,
  | 'id'
  | 'invoice'
  | 'redeemScript'
  | 'onchainAmount'
  | 'timeoutBlockHeight'
  | 'lockupAddress'
  | 'minerFeeInvoice'
  | 'receivingAddress'
  | 'preimage'
  | 'privateKey'
> & {
  decodedInvoice?: Pick<
    DecodeInvoice,
    | 'description'
    | 'destination'
    | 'expires_at'
    | 'id'
    | 'safe_tokens'
    | 'tokens'
    | 'destination_node'
  > | null;
} & { claimTransaction?: string };
