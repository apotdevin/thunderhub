import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Mutation,
  Query,
  registerEnumType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { UserConfigService } from './userConfig.service';
import { ConfigFields, ConfigState } from './userConfig.types';

registerEnumType(ConfigFields, { name: 'ConfigFields' });

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

  @ResolveField()
  onchain_push_enabled() {
    const { onchainPushEnabled } = this.userConfigService.getConfig();

    const disabled = this.configService.get('amboss.disableBalancePushes');

    if (disabled) {
      if (onchainPushEnabled) {
        this.logger.warn(
          'Balance pushes are enabled in the config file but disabled in the env file.'
        );
      }

      return false;
    }

    return onchainPushEnabled;
  }

  @ResolveField()
  channels_push_enabled() {
    const { channelPushEnabled } = this.userConfigService.getConfig();

    const disabled = this.configService.get('amboss.disableBalancePushes');

    if (disabled) {
      if (channelPushEnabled) {
        this.logger.warn(
          'Balance pushes are enabled in the config file but disabled in the env file.'
        );
      }

      return false;
    }

    return channelPushEnabled;
  }

  @ResolveField()
  private_channels_push_enabled() {
    const { privateChannelPushEnabled } = this.userConfigService.getConfig();

    const disabled = this.configService.get('amboss.disableBalancePushes');

    if (disabled) {
      if (privateChannelPushEnabled) {
        this.logger.warn(
          'Balance pushes are enabled in the config file but disabled in the env file.'
        );
      }

      return false;
    }

    return privateChannelPushEnabled;
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
  async toggleConfig(
    @Args('field', { type: () => ConfigFields }) field: ConfigFields
  ) {
    switch (field) {
      case ConfigFields.BACKUPS: {
        const disabled = this.configService.get('subscriptions.disableBackups');

        if (disabled) {
          throw new Error('Auto backups are disabled in the server.');
        }

        this.userConfigService.toggleAutoBackups();
        break;
      }
      case ConfigFields.HEALTHCHECKS: {
        const disabled = this.configService.get(
          'amboss.disableHealthCheckPings'
        );

        if (disabled) {
          throw new Error('Healthcheck pings are disabled in the server.');
        }

        this.userConfigService.toggleHealthCheckPing();
        break;
      }
      case ConfigFields.ONCHAIN_PUSH:
      case ConfigFields.CHANNELS_PUSH:
      case ConfigFields.PRIVATE_CHANNELS_PUSH: {
        const disabled = this.configService.get('amboss.disableBalancePushes');

        if (disabled) {
          throw new Error('Balance pushes are disabled in the server.');
        }

        switch (field) {
          case ConfigFields.ONCHAIN_PUSH:
            this.userConfigService.toggleOnChainPush();
            break;
          case ConfigFields.CHANNELS_PUSH:
            this.userConfigService.toggleChannelPush();
            break;
          case ConfigFields.PRIVATE_CHANNELS_PUSH:
            this.userConfigService.togglePrivateChannelPush();
            break;
        }

        break;
      }
    }

    return true;
  }
}
