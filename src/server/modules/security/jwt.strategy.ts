import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtObjectType, UserId } from './security.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: JwtObjectType): Promise<UserId> {
    if (!payload?.sub) {
      throw new Error('Unauthorized token');
    }

    const id: UserId = {
      id: payload.sub || '',
    };

    return id;
  }
}
