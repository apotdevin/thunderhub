import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserConfigService } from './userConfig.service';

@Resolver()
export class UserConfigResolver {
  constructor(
    private userConfigService: UserConfigService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => Boolean)
  async getBackupState() {
    const { backupsEnabled } = this.userConfigService.getConfig();

    const disabled = this.configService.get('subscriptions.disableBackups');

    if (disabled) {
      if (backupsEnabled) {
        this.logger.warn(
          'Auto backups is enabled in the config file but disabled in the env file.'
        );
      }

      return false;
    }

    return backupsEnabled;
  }

  @Mutation(() => Boolean)
  async toggleAutoBackups() {
    const disabled = this.configService.get('subscriptions.disableBackups');

    if (disabled) {
      throw new Error('Auto backups is disabled in the server.');
    }

    this.userConfigService.toggleAutoBackups();

    return true;
  }
}
