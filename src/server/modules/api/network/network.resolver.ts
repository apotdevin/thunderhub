import { Query, Resolver } from '@nestjs/graphql';

import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { NetworkInfo } from './network.types';

@Resolver()
export class NetworkResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => NetworkInfo)
  async getNetworkInfo(@CurrentUser() { id }: UserId) {
    const info = await this.nodeService.getNetworkInfo(id);

    return {
      averageChannelSize: info.average_channel_size,
      channelCount: info.channel_count,
      maxChannelSize: info.max_channel_size,
      medianChannelSize: info.median_channel_size,
      minChannelSize: info.min_channel_size,
      nodeCount: info.node_count,
      notRecentlyUpdatedPolicyCount: info.not_recently_updated_policy_count,
      totalCapacity: info.total_capacity,
    };
  }
}
