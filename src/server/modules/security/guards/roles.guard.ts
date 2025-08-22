import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IS_PUBLIC_KEY, Role, ROLES_KEY } from '../security.decorators';
import { UserId } from '../security.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // Early return if it's a public endpoint
    if (isPublic) return true;

    const decorator = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // If the endpoint does not need a role
    if (!decorator?.length) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext();

    const user: UserId | undefined = req?.user;

    // If the endpoint needs a role but no user is found in the request
    if (!user) {
      return false;
    }

    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
