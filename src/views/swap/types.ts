import {
  BoltzSwapStatus,
  CreateBoltzReverseSwapType,
  DecodeType,
  NodeType,
} from 'src/graphql/types';

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
  decodedInvoice?:
    | (Pick<
        DecodeType,
        | 'description'
        | 'destination'
        | 'expires_at'
        | 'id'
        | 'safe_tokens'
        | 'tokens'
      > & {
        destination_node: {
          node: Pick<NodeType, 'alias'>;
        };
      })
    | null;
} & { claimTransaction?: string };

export type EnrichedSwap = {
  boltz?: Pick<BoltzSwapStatus, 'status' | 'transaction'> | null;
} & CreateBoltzReverseSwap;
