import { ForwardType } from 'server/types/ln-service.types';

export interface ForwardCompleteProps {
  forwards: ForwardType[];
  next: string;
}

export interface ListProps {
  [key: string]: ForwardType[];
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

export interface InOutProps {
  tokens: number;
}

export interface InOutListProps {
  [key: string]: InOutProps[];
}

export interface PaymentProps {
  created_at: string;
  is_confirmed: boolean;
  tokens: number;
}

export interface PaymentsProps {
  payments: PaymentProps[];
}

export interface InvoiceProps {
  created_at: string;
  is_confirmed: boolean;
  received: number;
}

export interface InvoicesProps {
  invoices: InvoiceProps[];
  next: string;
}
