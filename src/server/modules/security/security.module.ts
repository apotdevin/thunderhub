import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { GqlAuthGuard } from './guards/graphql.guard';
import { RolesGuard } from './guards/roles.guard';
import { GqlThrottlerGuard as ThrottlerGuard } from './guards/throttler.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttler.ttl'),
          limit: config.get('throttler.limit') * 1000,
        },
      ],
    }),
  ],

  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AuthenticationModule {}
