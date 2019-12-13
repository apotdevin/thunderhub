export interface PaymentProps {
    created_at: string;
    destination: string;
    fee: number;
    fee_mtokens: string;
    hops: string[];
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    mtokens: string;
    request: string;
    secret: string;
    tokens: number;
}

export interface PaymentsProps {
    payments: PaymentProps[];
}

export interface InvoicePaymentProps {
    confirmed_at: string;
    created_at: string;
    created_height: number;
    in_channel: string;
    is_canceled: boolean;
    is_confirmed: boolean;
    is_held: boolean;
    mtokens: string;
    pending_index: number;
    tokens: number;
}

export interface InvoiceProps {
    chain_address: string;
    confirmed_at: string;
    created_at: string;
    description: string;
    description_hash: string;
    expires_at: string;
    id: string;
    is_canceled: boolean;
    is_confirmed: boolean;
    is_held: boolean;
    is_outgoing: boolean;
    is_private: boolean;
    payments: InvoicePaymentProps[];
    received: number;
    received_mtokens: string;
    request: string;
    secret: string;
    tokens: number;
}

export interface InvoicesProps {
    invoices: InvoiceProps[];
    next: string;
}

export interface NodeProps {
    alias: string;
}
