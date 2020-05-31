export interface ForwardProps {
  created_at: string;
  fee: number;
  fee_mtokens: string;
  incoming_channel: string;
  mtokens: string;
  outgoing_channel: string;
  tokens: number;
}

export interface ForwardCompleteProps {
  forwards: ForwardProps[];
  next: string;
}

export interface ListProps {
  [key: string]: ForwardProps[];
}

export interface ReduceObjectProps {
  fee: number;
  tokens: number;
}

export interface FinalProps {
  fee: number;
  tokens: number;
  amount: number;
}

export interface FinalList {
  [key: string]: FinalProps;
}

export interface CountProps {
  [key: string]: number;
}

export interface ChannelCounts {
  name: string;
  count: number;
}
