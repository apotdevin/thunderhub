import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../security.decorators';
import { Reflector } from '@nestjs/core';
import { AccountsService } from '../../accounts/accounts.service';
import { AuthType } from '../security.types';

@Injectable()
export class NodeSlugGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accountsService: AccountsService
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

    if (!req?.user || !nodeSlug) return true;

    if (req.user.authType === AuthType.YAML) {
      const account = this.accountsService.getAccountBySlug(nodeSlug);
      if (account) {
        req.user.id = account.hash;
      }
    } else if (req.user.authType === AuthType.USER) {
      const account = await this.accountsService.getDbNodeBySlug(
        nodeSlug,
        req.user.id
      );
      if (account) {
        req.user.userId = req.user.id;
        req.user.id = account.hash;
      }
    }

    return true;
  }
}
