import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { GqlAuthGuard } from './guards/graphql.guard';
import { NodeSlugGuard } from './guards/node-slug.guard';
import { GqlThrottlerGuard as ThrottlerGuard } from './guards/throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { TrustedHeaderMiddleware } from './trusted-header.middleware';

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
    TrustedHeaderMiddleware,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    { provide: APP_GUARD, useClass: NodeSlugGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrustedHeaderMiddleware).forRoutes('{*splat}');
  }
}
