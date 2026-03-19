import EventEmitter from 'events';

// ─── Account types ───────────────────────────────────────────────

export const NodeType = {
  LND: 'lnd',
  LITD: 'litd',
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

// ─── Capability flags ────────────────────────────────────────────

export enum Capability {
  WALLET_INFO = 'wallet_info',
  CHANNELS = 'channels',
  CHAIN = 'chain',
  INVOICES = 'invoices',
  PAYMENTS = 'payments',
  PEERS = 'peers',
  FORWARDS = 'forwards',
  BACKUPS = 'backups',
  MACAROONS = 'macaroons',
  SIGN_MESSAGE = 'sign_message',
  NETWORK_INFO = 'network_info',
  ROUTING_FEES = 'routing_fees',
  DIFFIE_HELLMAN = 'diffie_hellman',
  TAPROOT_ASSETS = 'taproot_assets',
}

// ─── Common arg types ────────────────────────────────────────────

export type GetChannelsOptions = {
  is_active?: boolean;
  is_offline?: boolean;
  is_private?: boolean;
  is_public?: boolean;
  partner_public_key?: string;
};

export type GetForwardsOptions = {
  after?: string;
  before?: string;
  limit?: number;
  token?: string;
};

export type GetPaymentsOptions = {
  limit?: number;
  token?: string;
};

export type GetInvoicesOptions = {
  limit?: number;
  token?: string;
};

export type CloseChannelOptions = {
  id?: string;
  is_force_close?: boolean;
  target_confirmations?: number;
  tokens_per_vbyte?: number;
  transaction_id?: string;
  transaction_vout?: number;
};

export type OpenChannelOptions = {
  local_tokens: number;
  partner_public_key: string;
  chain_fee_tokens_per_vbyte?: number;
  give_tokens?: number;
  is_private?: boolean;
};

export type PayOptions = {
  request?: string;
  max_fee?: number;
  max_fee_mtokens?: string;
  outgoing_channel?: string;
  tokens?: number;
};

export type CreateInvoiceOptions = {
  tokens?: number;
  description?: string;
  description_hash?: string;
  expires_at?: string;
  is_including_private_channels?: boolean;
  is_fallback_included?: boolean;
  secret?: string;
};

export type PayViaPaymentDetailsOptions = {
  id: string;
  destination: string;
  tokens?: number;
  mtokens?: string;
  max_fee?: number;
  max_fee_mtokens?: string;
  messages?: { type: string; value: string }[];
};

export type SendToChainAddressOptions = {
  address: string;
  tokens?: number;
  fee_tokens_per_vbyte?: number;
  target_confirmations?: number;
  is_send_all?: boolean;
};

export type CreateChainAddressFormat = 'np2wpkh' | 'p2wpkh' | 'p2tr';

export type UpdateRoutingFeesOptions = {
  transaction_id?: string;
  transaction_vout?: number;
  base_fee_mtokens?: string;
  base_fee_tokens?: number;
  cltv_delta?: number;
  fee_rate?: number;
  max_htlc_mtokens?: string;
  min_htlc_mtokens?: string;
};

export type VerifyBackupsOptions = {
  backup: string;
  channels: { transaction_id: string; transaction_vout: number }[];
};

export type GrantAccessOptions = {
  is_ok_to_adjust_peers?: boolean;
  is_ok_to_create_chain_addresses?: boolean;
  is_ok_to_create_invoices?: boolean;
  is_ok_to_create_macaroons?: boolean;
  is_ok_to_derive_keys?: boolean;
  is_ok_to_get_chain_transactions?: boolean;
  is_ok_to_get_invoices?: boolean;
  is_ok_to_get_wallet_info?: boolean;
  is_ok_to_get_payments?: boolean;
  is_ok_to_get_peers?: boolean;
  is_ok_to_pay?: boolean;
  is_ok_to_send_to_chain_addresses?: boolean;
  is_ok_to_sign_bytes?: boolean;
  is_ok_to_sign_messages?: boolean;
  is_ok_to_stop_daemon?: boolean;
  is_ok_to_verify_bytes_signatures?: boolean;
  is_ok_to_verify_messages?: boolean;
};

export type DiffieHellmanComputeSecretOptions = {
  partner_public_key: string;
  key_family?: number;
  key_index?: number;
};

// ─── The provider interface ──────────────────────────────────────

export interface LightningProvider {
  /** Which capabilities this provider supports */
  getCapabilities(): Set<Capability>;

  // ── Wallet ──
  getWalletInfo(connection: any): Promise<any>;
  getIdentity(connection: any): Promise<any>;
  getWalletVersion(connection: any): Promise<any>;
  getHeight(connection: any): Promise<any>;

  // ── Channels ──
  getChannels(connection: any, options?: GetChannelsOptions): Promise<any>;
  getClosedChannels(connection: any): Promise<any>;
  getPendingChannels(connection: any): Promise<any>;
  getChannel(connection: any, id: string): Promise<any>;
  openChannel(connection: any, options: OpenChannelOptions): Promise<any>;
  closeChannel(connection: any, options: CloseChannelOptions): Promise<any>;
  getChannelBalance(connection: any): Promise<any>;

  // ── Chain ──
  getChainBalance(connection: any): Promise<any>;
  getPendingChainBalance(connection: any): Promise<any>;
  getChainTransactions(connection: any): Promise<any>;
  getUtxos(connection: any): Promise<any>;
  createChainAddress(
    connection: any,
    is_unused: boolean,
    format: CreateChainAddressFormat
  ): Promise<any>;
  sendToChainAddress(
    connection: any,
    options: SendToChainAddressOptions
  ): Promise<any>;

  // ── Payments ──
  pay(connection: any, options: PayOptions): Promise<any>;
  payViaPaymentDetails(
    connection: any,
    options: PayViaPaymentDetailsOptions
  ): Promise<any>;
  decodePaymentRequest(connection: any, request: string): Promise<any>;
  getPayments(connection: any, options: GetPaymentsOptions): Promise<any>;

  // ── Invoices ──
  createInvoice(connection: any, options: CreateInvoiceOptions): Promise<any>;
  getInvoices(connection: any, options: GetInvoicesOptions): Promise<any>;
  subscribeToInvoice(connection: any, id: string): EventEmitter;

  // ── Peers ──
  getPeers(connection: any): Promise<any>;
  addPeer(
    connection: any,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ): Promise<any>;
  removePeer(connection: any, public_key: string): Promise<any>;

  // ── Forwards ──
  getForwards(connection: any, options: GetForwardsOptions): Promise<any>;

  // ── Routing ──
  updateRoutingFees(
    connection: any,
    options: UpdateRoutingFeesOptions
  ): Promise<any>;

  // ── Network ──
  getNode(
    connection: any,
    public_key: string,
    is_omitting_channels?: boolean
  ): Promise<any>;
  getNetworkInfo(connection: any): Promise<any>;

  // ── Messages ──
  signMessage(connection: any, message: string): Promise<any>;
  verifyMessage(
    connection: any,
    message: string,
    signature: string
  ): Promise<any>;

  // ── Backups ──
  getBackups(connection: any): Promise<any>;
  verifyBackup(connection: any, backup: string): Promise<any>;
  verifyBackups(connection: any, args: VerifyBackupsOptions): Promise<any>;
  recoverFundsFromChannels(connection: any, backup: string): Promise<any>;

  // ── Access ──
  grantAccess(connection: any, permissions: GrantAccessOptions): Promise<any>;

  // ── Crypto ──
  diffieHellmanComputeSecret(
    connection: any,
    options: DiffieHellmanComputeSecretOptions
  ): Promise<any>;

  // ── Subscriptions ──
  /** Extract the raw AuthenticatedLnd handle for use by subscription service */
  getSubscriptionConnection(connection: any): any;

  // ── Connection ──
  /** Create a connection object from account config */
  connect(config: {
    socket: string;
    cert?: string;
    macaroon?: string;
    authToken?: string;
  }): any;
}
