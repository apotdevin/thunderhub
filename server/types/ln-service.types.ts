export type LndObject = {};

export type PayInvoiceType = {
  fee: number;
  fee_mtokens: string;
  hops: [
    {
      channel: string;
      channel_capacity: number;
      fee_mtokens: string;
      forward_mtokens: string;
      timeout: number;
    }
  ];
  id: string;
  is_confirmed: boolean;
  is_outgoing: boolean;
  mtokens: string;
  secret: string;
  safe_fee: number;
  safe_tokens: number;
  tokens: number;
};

export type ChannelType = {
  id: string;
  tokens: number;
  is_partner_initiated: boolean;
  commit_transaction_fee: number;
  is_active: boolean;
  local_balance: number;
  remote_balance: number;
  partner_public_key: string;
  time_offline?: number;
  time_online?: number;
  pending_payments: [
    { id: string; is_outgoing: boolean; timeout: number; tokens: number }
  ];
};

export type DecodedType = {
  destination: string;
  tokens: number;
};

export type GetPublicKeyType = {
  public_key: string;
};

export type ClosedChannelsType = {
  channels: [];
};

export type CreateInvoiceType = {
  chain_address?: string;
  created_at: string;
  description: string;
  id: string;
  mtokens?: string;
  request: string;
  secret: string;
  tokens?: number;
};

export type CloseChannelType = {
  transaction_id: string;
  transaction_vout: number;
};

export type OpenChannelType = {
  transaction_id: string;
  transaction_vout: number;
};

export type InvoiceType = {
  id: string;
  created_at: string;
  confirmed_at: string;
  tokens: number;
  is_confirmed: boolean;
  received: number;
  payments: { messages: [{ type: string; value: string }] }[];
};

export type PaymentType = {
  created_at: string;
  is_confirmed: boolean;
  tokens: number;
  destination: string;
  hops: string[];
};

export type ForwardType = {
  tokens: number;
  incoming_channel: string;
  outgoing_channel: string;
  created_at: string;
  fee: number;
};

export type GetWalletInfoType = {
  alias: string;
  public_key: string;
};

export type DiffieHellmanComputeSecretType = {
  secret: string;
};

export type GetNodeType = { alias: string; color: string };

export type UtxoType = {};

export type ChainTransaction = {};

export type ProbeForRouteType = { route?: { hops: [{ public_key: string }] } };

export type GetChannelType = {
  policies: {
    public_key: string;
    base_fee_mtokens: string;
    fee_rate: number;
  }[];
};

export type GetClosedChannelsType = { channels: ChannelType[] };

export type GetChannelsType = { channels: ChannelType[] };

export type GetForwardsType = { forwards: ForwardType[]; next?: string };

export type GetInvoicesType = { invoices: InvoiceType[]; next?: string };

export type GetPaymentsType = { payments: PaymentType[]; next?: string };

export type GetChainBalanceType = { chain_balance: number };

export type GetPendingChainBalanceType = { pending_chain_balance: number };

export type GetChainTransactionsType = { transactions: ChainTransaction[] };

export type GetUtxosType = { utxos: UtxoType[] };

export type CreateChainAddressType = { address: string };

export type SendToChainAddressType = {
  id: string;
  confirmation_count: number;
  is_confirmed: boolean;
  is_outgoing: boolean;
  tokens: number | null;
};
