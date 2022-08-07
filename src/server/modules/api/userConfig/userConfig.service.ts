import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FilesService } from '../../files/files.service';
import { ConfigType } from '../../files/files.types';

@Injectable()
export class UserConfigService implements OnModuleInit {
  config: ConfigType;

  constructor(
    private filesService: FilesService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async onModuleInit() {
    this.config = this.getConfig();
  }

  getConfig(): ConfigType {
    const accountConfigPath = this.configService.get('accountConfigPath');
    const yaml = this.filesService.parseYaml(accountConfigPath);

    if (!yaml) {
      this.logger.info(
        `No account config file found at path ${accountConfigPath}`
      );
      return {
        backupsEnabled: false,
        healthCheckPingEnabled: false,
        onchainPushEnabled: false,
        channelPushEnabled: false,
        privateChannelPushEnabled: false,
      };
    }

    return {
      backupsEnabled: !!yaml.backupsEnabled,
      healthCheckPingEnabled: !!yaml.healthCheckPingEnabled,
      onchainPushEnabled: !!yaml.onchainPushEnabled,
      channelPushEnabled: !!yaml.channelPushEnabled,
      privateChannelPushEnabled: !!yaml.privateChannelPushEnabled,
    };
  }

  toggleValue(field: string): void {
    const accountConfigPath = this.configService.get('accountConfigPath');

    if (!accountConfigPath) {
      this.logger.verbose('No config file path provided');
      throw new Error('Error enabling auto backups');
    }

    const accountConfig = this.filesService.parseYaml(accountConfigPath);

    if (!accountConfig) {
      this.logger.info(`No config file found at path ${accountConfigPath}`);
      throw new Error('Error enabling auto backups');
    }

    const currentStatus = accountConfig[field];
    const configCopy = {
      ...accountConfig,
      [field]: !currentStatus,
    };

    this.config = configCopy;
    this.filesService.saveHashedYaml(configCopy, accountConfigPath);
  }

  togglePrivateChannelPush(): void {
    this.toggleValue('privateChannelPushEnabled');
  }

  toggleChannelPush(): void {
    this.toggleValue('channelPushEnabled');
  }

  toggleOnChainPush(): void {
    this.toggleValue('onchainPushEnabled');
  }

  toggleHealthCheckPing(): void {
    this.toggleValue('healthCheckPingEnabled');
  }

  toggleAutoBackups(): void {
    this.toggleValue('backupsEnabled');
  }
}
