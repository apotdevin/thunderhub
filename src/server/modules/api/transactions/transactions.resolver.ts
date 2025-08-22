import { Args, Query, Resolver } from '@nestjs/graphql';
import { decodeMessages } from 'src/server/utils/customRecords';

import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { GetInvoicesType, GetPaymentsType } from './transactions.types';

@Resolver()
export class TransactionsResolver {
  constructor(private nodeService: NodeService) {}

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
