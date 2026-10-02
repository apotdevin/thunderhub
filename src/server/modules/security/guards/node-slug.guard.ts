import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../security.decorators';
import { Reflector } from '@nestjs/core';
import { PrincipalService } from '../../principal/principal.service';
import { UserId } from '../security.types';

/**
 * Resolves the `x-node-slug` header to a node the session may open and puts
 * that node's hash in `req.user.id`, which is what resolvers hand to
 * `NodeService`. A slug the principal is not allowed to open is refused.
 */
@Injectable()
export class NodeSlugGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private principalService: PrincipalService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (context.getType<string>() !== 'graphql') return true;

    const ctx = GqlExecutionContext.create(context);
    const { nodeSlug } = ctx.getContext();
    const req = ctx.getContext().req;
    const user: UserId | undefined = req?.user;

    if (!user?.principal || !nodeSlug) return true;

    const account = await this.principalService.resolveNode(
      user.principal,
      nodeSlug
    );

    if (!account) return false;

    user.id = account.hash;
    return true;
  }
}
