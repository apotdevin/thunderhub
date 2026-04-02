import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Public } from '../../security/security.decorators';
import { Throttle, seconds } from '@nestjs/throttler';
import { UserService } from '../../user/user.service';
import { CreateInitialUserResult, PublicMutation } from './public.types';

@Resolver(() => PublicMutation)
export class PublicResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Public()
  @Mutation(() => PublicMutation)
  async public() {
    return {};
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: seconds(10) } })
  @ResolveField(() => CreateInitialUserResult)
  async create_initial_user(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<CreateInitialUserResult> {
    if (!this.userService.isDbEnabled()) {
      throw new Error('Database is not enabled');
    }

    const needsSetup = await this.userService.needsSetup();
    if (!needsSetup) {
      throw new Error('Initial setup has already been completed');
    }

    if (!email || !email.includes('@')) {
      throw new Error('A valid email is required');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    this.logger.info('Creating initial owner user', { email });

    return this.userService.createInitialUser(email, password);
  }
}
