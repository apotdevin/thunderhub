import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { getIp } from 'src/server/utils/request';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number
  ): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req, connection } = gqlCtx.getContext();

    const request = connection?.context?.req ? connection.context.req : req;
    const ip = getIp(request);
    const key = this.generateKey(context, ip);
    const ttls = await this.storageService.getRecord(key);

    if (ttls.length >= limit) {
      throw new ThrottlerException();
    }

    await this.storageService.addRecord(key, ttl);
    return true;
  }
}
