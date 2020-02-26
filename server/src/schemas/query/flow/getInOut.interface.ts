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
