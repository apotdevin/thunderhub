import { Args, Query, Resolver } from '@nestjs/graphql';
import { decodeMessages } from 'src/server/utils/customRecords';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  GetInvoicesType,
  GetPaymentsType,
  InvoiceType,
  PaymentType,
} from './transactions.types';

@Resolver()
export class TransactionsResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => InvoiceType)
  async getInvoice(@CurrentUser() user: UserId, @Args('id') id: string) {
    const invoice = await this.nodeService.getInvoice(user.id, { id });

    return {
      ...invoice,
      type: 'invoice',
      date: invoice.confirmed_at || invoice.created_at,
      payments: invoice.payments.map(p => ({
        ...p,
        messages: decodeMessages(p.messages),
      })),
    };
  }

  @Query(() => GetInvoicesType)
  async getInvoices(
    @CurrentUser() user: UserId,
    @Args('token', { nullable: true }) token: string
  ) {
    const { next, invoices } = await this.nodeService.getInvoices(user.id, {
      ...(token ? { token } : { limit: 50 }),
    });

    const mapped = invoices.map(invoice => ({
      ...invoice,
      type: 'invoice',
      date: invoice.confirmed_at || invoice.created_at,
      payments: invoice.payments.map(p => ({
        ...p,
        messages: decodeMessages(p.messages),
      })),
    }));

    return { next, invoices: mapped };
  }

  @Query(() => PaymentType)
  async getPayment(@CurrentUser() user: UserId, @Args('id') id: string) {
    const result = await this.nodeService.getPayment(user.id, { id });
    const payment = result?.payment;

    if (!payment) {
      throw new Error('Payment not found');
    }

    return {
      ...payment,
      type: 'payment',
      date: payment.created_at,
      is_confirmed: result.is_confirmed ?? false,
      is_outgoing: true,
      safe_fee: payment.fee,
      safe_tokens: payment.tokens,
      destination_node: { publicKey: payment.destination },
      hops: payment.hops.map((hop: { public_key: string }) => ({
        publicKey: hop.public_key,
      })),
    };
  }

  @Query(() => GetPaymentsType)
  async getPayments(
    @CurrentUser() user: UserId,
    @Args('token', { nullable: true }) token: string
  ) {
    const { next, payments } = await this.nodeService.getPayments(user.id, {
      ...(token ? { token } : { limit: 10 }),
    });

    const mapped = payments.map(payment => ({
      ...payment,
      type: 'payment',
      date: payment.created_at,
      destination_node: { publicKey: payment.destination },
      hops: [...payment.hops.map(hop => ({ publicKey: hop }))],
    }));

    return { next, payments: mapped };
  }
}
