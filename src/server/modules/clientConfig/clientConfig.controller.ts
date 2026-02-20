import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../security/security.decorators';
import { ClientConfig } from '../../config/configuration';

@Controller('api')
@Public()
@SkipThrottle()
export class ClientConfigController {
  constructor(private configService: ConfigService) {}

  @Get('config')
  getConfig(): ClientConfig {
    return this.configService.get<ClientConfig>('clientConfig');
  }
}
