import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerOptions,
} from '@nestjs/throttler';
import { getIp } from 'src/server/utils/request';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions
  ): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req, connection } = gqlCtx.getContext();

    const request = connection?.context?.req ? connection.context.req : req;
    const ip = getIp(request);
    const key = this.generateKey(context, ip, throttler.name);
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits >= limit) {
      throw new ThrottlerException();
    }

    return true;
  }
}
