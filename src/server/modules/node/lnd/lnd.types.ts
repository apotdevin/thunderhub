export type LndObject = any;

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

export type PayInvoiceParams = {
  request: string;
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

export type CreateInvoiceParams = {
  tokens: number;
  description?: string;
};

export type OpenChannelType = {
  transaction_id: string;
  transaction_vout: number;
};

export type Invoice = {
  id: string;
  created_at: string;
  confirmed_at: string;
  tokens: number;
  is_confirmed: boolean;
  received: number;
  payments: { messages: [{ type: string; value: string }] }[];
};

export type Payment = {
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
  version: string;
  current_block_height: number;
};

export type DiffieHellmanComputeSecretType = {
  secret: string;
};

export type GetNodeType = { alias: string; color: string };

export type UtxoType = {
  address: string;
  address_format: string;
  confirmation_count: number;
  output_script: string;
  tokens: number;
  transaction_id: string;
  transaction_vout: number;
};

export type ChainTransaction = {
  block_id?: string;
  confirmation_count?: number;
  confirmation_height?: number;
  created_at: string;
  description?: string;
  fee?: number;
  id: string;
  is_confirmed: boolean;
  is_outgoing: boolean;
  output_addresses: string[];
  tokens: number;
  transaction?: string;
};

export type ProbeForRouteType = { route?: { hops: [{ public_key: string }] } };

export type GetChannelType = {
  policies: {
    public_key: string;
    base_fee_mtokens: string;
    fee_rate: number;
  }[];
};

export type GetHeightType = {
  current_block_hash: string;
  current_block_height: number;
};

export type ClosedPayment = {
  is_outgoing: string;
  is_paid: string;
  is_pending: string;
  is_refunded: string;
  spent_by?: string;
  tokens: number;
  transaction_id: string;
  transaction_vout: number;
};

export type ClosedChannelType = {
  capacity: number;
  close_balance_spent_by?: string;
  close_balance_vout?: number;
  close_payments: ClosedPayment[];
  close_confirm_height?: number;
  close_transaction_id?: string;
  final_local_balance: number;
  final_time_locked_balance: number;
  id?: string;
  is_breach_close: string;
  is_cooperative_close: string;
  is_funding_cancel: string;
  is_local_force_close: string;
  is_partner_closed?: string;
  is_partner_initiated?: string;
  is_remote_force_close: string;
  partner_public_key: string;
  transaction_id: string;
  transaction_vout: number;
};

export type GetClosedChannelsType = { channels: ClosedChannelType[] };

export type GetChannelsType = { channels: ChannelType[] };

export type GetChannelsParams = { is_active?: boolean };

export type GetForwardsType = { forwards: ForwardType[]; next?: string };

export type GetInvoices = { invoices: Invoice[]; next?: string };

export type GetPayments = { payments: Payment[]; next?: string };

export type GetChainBalanceType = { chain_balance: number };

export type GetChannelBalanceType = {
  channel_balance: number;
  pending_balance: number;
};

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

export type PendingChannelType = {
  close_transaction_id: string;
  is_active: boolean;
  is_closing: boolean;
  is_opening: boolean;
  is_timelocked: boolean;
  local_balance: number;
  local_reserve: number;
  partner_public_key: string;
  received: number;
  remote_balance: number;
  remote_reserve: number;
  sent: number;
  transaction_fee: number;
  transaction_id: string;
  transaction_vout: number;
  timelock_blocks?: number;
  timelock_expiration?: number;
};

export type GetPendingChannelsType = { pending_channels: PendingChannelType[] };

export type BackupChannel = {
  transaction_id: string;
  transaction_vout: number;
};

export type Permissions = {
  is_ok_to_adjust_peers: boolean;
  is_ok_to_create_chain_addresses: boolean;
  is_ok_to_create_invoices: boolean;
  is_ok_to_create_macaroons: boolean;
  is_ok_to_derive_keys: boolean;
  is_ok_to_get_chain_transactions: boolean;
  is_ok_to_get_invoices: boolean;
  is_ok_to_get_wallet_info: boolean;
  is_ok_to_get_payments: boolean;
  is_ok_to_get_peers: boolean;
  is_ok_to_pay: boolean;
  is_ok_to_send_to_chain_addresses: boolean;
  is_ok_to_sign_bytes: boolean;
  is_ok_to_sign_messages: boolean;
  is_ok_to_stop_daemon: boolean;
  is_ok_to_verify_bytes_signatures: boolean;
  is_ok_to_verify_messages: boolean;
};

export type VerifyMessage = {
  signed_by: string;
};

export type SignMessage = {
  signature: string;
};

export type GrantAccess = { macaroon: string; permissions: string[] };

export type NetworkInfo = {
  average_channel_size: number;
  channel_count: number;
  max_channel_size: number;
  median_channel_size: number;
  min_channel_size: number;
  node_count: number;
  not_recently_updated_policy_count: number;
  total_capacity: number;
};

export type Peer = {
  bytes_received: number;
  bytes_sent: number;
  is_inbound: boolean;
  is_sync_peer: boolean;
  ping_time: number;
  public_key: string;
  socket: string;
  tokens_received: number;
  tokens_sent: number;
};

export type GetPeers = { peers: Peer[] };

export type SendToChainParams = {
  address: string;
  fee_tokens_per_vbyte?: number;
  is_send_all?: boolean;
  target_confirmations?: number;
  tokens?: number;
};

export type DiffieHellmanComputeSecretParams = {
  key_family?: number;
  key_index?: number;
  partner_public_key: string;
};

export type DiffieHellmanComputeSecretResult = {
  secret: string;
};

export type CloseChannelParams = {
  id: string;
  target_confirmations: number;
  tokens_per_vbyte: number;
  is_force_close: boolean;
};

export type CloseChannel = {
  transaction_id: string;
  transaction_vout: number;
};

export type OpenChannel = {
  transaction_id: string;
  transaction_vout: number;
};

export type OpenChannelParams = {
  is_private: boolean;
  local_tokens: number;
  partner_public_key: string;
  chain_fee_tokens_per_vbyte: number;
  give_tokens: number;
};

export type UpdateRoutingFeeFailure = {
  failure: string;
  is_pending_channel: boolean;
  is_unknown_channel: boolean;
  is_invalid_policy: boolean;
  transaction_id: string;
  transaction_vout: number;
};

export type UpdateRoutingFees = {
  failures: UpdateRoutingFeeFailure[];
};

export type UpdateRoutingFeesParams = {
  transaction_id?: string;
  transaction_vout?: number;
  base_fee_mtokens?: string;
  base_fee_tokens?: number;
  cltv_delta?: number;
  fee_rate?: number;
  max_htlc_mtokens?: string;
  min_htlc_mtokens?: string;
};

export type Forward = {
  created_at: string;
  fee: number;
  fee_mtokens: string;
  incoming_channel: string;
  mtokens: string;
  outgoing_channel: string;
  tokens: number;
};

export type GetForwards = {
  forwards: Forward[];
  next?: string;
};

export type GetForwardsParams = {
  after?: string;
  before?: string;
  token?: string;
};

export type GetPaymentsParams = {
  limit?: number;
  token?: string;
};

type PaymentDetailMessages = {
  type: string;
  value: string;
};

export type PayViaPaymentDetailsParams = {
  id: string;
  tokens: number;
  destination: string;
  max_fee?: number;
  messages: PaymentDetailMessages[];
};
