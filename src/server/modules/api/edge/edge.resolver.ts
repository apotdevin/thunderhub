import { Query, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { ChannelReport } from './edge.types';

@Resolver()
export class EdgeResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => ChannelReport)
  async getChannelReport(@CurrentUser() { id }: UserId) {
    const { channels } = await this.nodeService.getChannels(id);

    if (!channels?.length) return;

    const pending = channels.reduce(
      (prev, current) => {
        const { pending_payments } = current;

        const total = pending_payments.length;
        const outgoing = pending_payments.filter(p => p.is_outgoing).length;
        const incoming = total - outgoing;

        return {
          totalPendingHtlc: prev.totalPendingHtlc + total,
          outgoingPendingHtlc: prev.outgoingPendingHtlc + outgoing,
          incomingPendingHtlc: prev.incomingPendingHtlc + incoming,
        };
      },
      {
        totalPendingHtlc: 0,
        outgoingPendingHtlc: 0,
        incomingPendingHtlc: 0,
      }
    );

    const commit = channels
      .filter(c => !c.is_partner_initiated)
      .map(c => c.commit_transaction_fee)
      .reduce((total, fee) => total + fee, 0);

    const localBalances = channels
      .filter(c => c.is_active)
      .map(c => c.local_balance);

    const remoteBalances = channels
      .filter(c => c.is_active)
      .map(c => c.remote_balance);

    const local =
      localBalances.reduce((total, size) => total + size, 0) - commit;
    const remote = remoteBalances.reduce((total, size) => total + size, 0);
    const maxOut = Math.max(...localBalances);
    const maxIn = Math.max(...remoteBalances);

    return {
      local,
      remote,
      maxIn,
      maxOut,
      commit,
      ...pending,
    };
  }
}
