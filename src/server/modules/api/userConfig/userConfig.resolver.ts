import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserConfigService } from './userConfig.service';
import { ConfigState } from './userConfig.types';

@Resolver(ConfigState)
export class UserConfigStateResolver {
  constructor(
    private userConfigService: UserConfigService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField()
  backup_state() {
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

  @ResolveField()
  healthcheck_ping_state() {
    const { healthCheckPingEnabled } = this.userConfigService.getConfig();

    const disabled = this.configService.get('amboss.disableHealthCheckPings');

    if (disabled) {
      if (healthCheckPingEnabled) {
        this.logger.warn(
          'Auto backups is enabled in the config file but disabled in the env file.'
        );
      }

      return false;
    }

    return healthCheckPingEnabled;
  }
}

@Resolver()
export class UserConfigResolver {
  constructor(
    private userConfigService: UserConfigService,
    private configService: ConfigService
  ) {}

  @Query(() => ConfigState)
  async getConfigState() {
    return {};
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

  @Mutation(() => Boolean)
  async toggleHealthPings() {
    const disabled = this.configService.get('amboss.disableHealthCheckPings');

    if (disabled) {
      throw new Error('Healthcheck pings is disabled in the server.');
    }

    this.userConfigService.toggleHealthCheckPing();

    return true;
  }
}
