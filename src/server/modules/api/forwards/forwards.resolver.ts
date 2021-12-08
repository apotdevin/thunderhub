import { Args, Query, Resolver } from '@nestjs/graphql';
import { sortBy } from 'lodash';
import { subDays } from 'date-fns';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import { Forward } from './forwards.types';

@Resolver()
export class ForwardsResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => [Forward])
  async getForwards(@CurrentUser() user: UserId, @Args('days') days: number) {
    const today = new Date();
    const startDate = subDays(today, days);

    const forwardsList = await this.nodeService.getForwards(user.id, {
      after: startDate.toISOString(),
      before: today.toISOString(),
    });

    let forwards = forwardsList.forwards;
    let next = forwardsList.next;

    let finishedFetching = false;

    if (!next || !forwards || forwards.length <= 0) {
      finishedFetching = true;
    }

    while (!finishedFetching) {
      if (next) {
        const moreForwards = await this.nodeService.getForwards(user.id, {
          token: next,
        });

        forwards = [...forwards, ...moreForwards.forwards];
        next = moreForwards.next;
      } else {
        finishedFetching = true;
      }
    }

    return sortBy(forwards, 'created_at').reverse();
  }
}
