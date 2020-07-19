export type LndObject = {};

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
};

export type DecodedType = {
  destination: string;
  tokens: number;
};

export type ClosedChannelsType = {
  channels: [];
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
};

export type ForwardType = {
  tokens: number;
  incoming_channel: string;
  outgoing_channel: string;
  created_at: string;
};

export type GetWalletInfoType = {
  alias: string;
  public_key: string;
};

export type ProbeForRouteType = { route?: { hops: [{ public_key: string }] } };

export type GetChannelsType = { channels: ChannelType[] };

export type GetForwardsType = { forwards: ForwardType[]; next?: string };

export type GetInvoicesType = { invoices: InvoiceType[]; next?: string };

export type GetPaymentsType = { payments: PaymentType[]; next?: string };
