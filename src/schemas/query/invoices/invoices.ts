import { GraphQLList } from "graphql";
import { getInvoices as getLnInvoices } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { GetInvoiceType } from "../../../schemaTypes/query/info/invoices";

interface PaymentProps {
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

interface InvoiceProps {
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
  payments: PaymentProps[];
  received: number;
  received_mtokens: string;
  request: string;
  secret: string;
  tokens: number;
}

interface InvoicesProps {
  invoices: InvoiceProps[];
  next: string;
}

export const getInvoices = {
  type: new GraphQLList(GetInvoiceType),
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "channels", 1, "1s");
    const { lnd } = context;

    try {
      const invoiceList: InvoicesProps = await getLnInvoices({
        lnd: lnd
      });

      const invoices = invoiceList.invoices.map(invoice => {
        const payments = invoice.payments.map(payment => ({
          confirmedAt: payment.confirmed_at,
          createdAt: payment.created_at,
          createdHeight: payment.created_height,
          inChannel: payment.in_channel,
          isCanceled: payment.is_canceled,
          isConfirmed: payment.is_confirmed,
          isHeld: payment.is_held,
          mtokens: payment.mtokens,
          pendingIndex: payment.pending_index,
          tokens: payment.tokens
        }));

        return {
          chainAddress: invoice.chain_address,
          confirmedAt: invoice.confirmed_at,
          createdAt: invoice.created_at,
          description: invoice.description,
          descriptionHash: invoice.description_hash,
          expiresAt: invoice.expires_at,
          id: invoice.id,
          isCanceled: invoice.is_canceled,
          isConfirmed: invoice.is_confirmed,
          isHeld: invoice.is_held,
          isOutgoing: invoice.is_outgoing,
          isPrivate: invoice.is_private,
          payments: payments,
          received: invoice.received,
          receivedMtokens: invoice.received_mtokens,
          request: invoice.request,
          secret: invoice.secret,
          tokens: invoice.tokens
        };
      });

      return invoices;
    } catch (error) {
      logger.error("Error getting invoices: %o", error);
      throw new Error("Failed to get invoices.");
    }
  }
};
