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
      return { backupsEnabled: false, healthCheckPingEnabled: false };
    }

    return {
      backupsEnabled: !!yaml.backupsEnabled,
      healthCheckPingEnabled: !!yaml.healthCheckPingEnabled,
    };
  }

  toggleHealthCheckPing(): void {
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

    const currentStatus = accountConfig.healthCheckPingEnabled;
    const configCopy = {
      ...accountConfig,
      healthCheckPingEnabled: !currentStatus,
    };

    this.config = configCopy;
    this.filesService.saveHashedYaml(configCopy, accountConfigPath);
  }

  toggleAutoBackups(): void {
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

    const currentStatus = accountConfig.backupsEnabled;
    const configCopy = { ...accountConfig, backupsEnabled: !currentStatus };

    this.config = configCopy;
    this.filesService.saveHashedYaml(configCopy, accountConfigPath);
  }
}
