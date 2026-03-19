import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EnrichedAccount } from './accounts.types';
import { ProviderRegistryService } from '../node/provider-registry.service';
import { NodeType } from '../node/lightning.types';

@Injectable()
export class AccountsService implements OnModuleInit {
  accounts: { [key: string]: EnrichedAccount } = {};

  constructor(
    private configService: ConfigService,
    private filesService: FilesService,
    private providerRegistry: ProviderRegistryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async onModuleInit(): Promise<void> {
    // Initialize cookie file if cookie path is provided
    this.filesService.readCookie();

    const macaroonPath = this.configService.get('sso.macaroonPath');
    const certPath = this.configService.get('sso.certPath');
    const accountConfigPath = this.configService.get('accountConfigPath');

    const ssoUrl = this.configService.get('sso.serverUrl');
    const ssoMacaroon = this.filesService.readMacaroons(macaroonPath);
    const ssoCert = this.filesService.readFile(certPath);

    if (ssoUrl && ssoMacaroon) {
      if (!ssoCert) {
        this.logger.warning(
          'No certificate provided for SSO account. Make sure you do not need it to connect.'
        );
      }

      const sso = {
        type: NodeType.LND,
        index: 999,
        name: 'SSO Account',
        id: '',
        password: '',
        encrypted: false,
        encryptedMacaroon: '',
        macaroon: ssoMacaroon,
        socket: ssoUrl,
        cert: ssoCert,
        twofaSecret: '',
      };

      const provider = this.providerRegistry.getProvider(NodeType.LND);
      const connection = provider.connect({
        socket: ssoUrl,
        cert: ssoCert || undefined,
        macaroon: ssoMacaroon,
      });

      this.accounts['sso'] = {
        ...sso,
        hash: 'sso',
        connection,
      };
    }

    const accounts = this.filesService.getAccounts(accountConfigPath);

    if (!accounts.length) return;

    accounts.forEach(account => {
      const nodeType = account.type || NodeType.LND;

      if (!this.providerRegistry.hasProvider(nodeType)) {
        this.logger.error(
          `No provider registered for account type "${nodeType}" (account: ${account.name}). Skipping.`
        );
        return;
      }

      const provider = this.providerRegistry.getProvider(nodeType);
      const connection = provider.connect({
        socket: account.socket,
        cert: account.cert || undefined,
        macaroon: account.macaroon || undefined,
        authToken: account.authToken,
      });

      this.accounts[account.hash] = {
        ...account,
        type: nodeType,
        connection,
      };
    });
  }

  getAccount(id: string) {
    if (!id) return null;
    return this.accounts[id] || null;
  }

  getAllAccounts() {
    return this.accounts;
  }

  updateAccountMacaroon(id: string, macaroon: string): void {
    if (this.accounts?.[id]) {
      const account = this.accounts[id];
      const provider = this.providerRegistry.getProvider(account.type);
      const connection = provider.connect({
        socket: account.socket,
        cert: account.cert || undefined,
        macaroon,
      });

      this.accounts[id].macaroon = macaroon;
      this.accounts[id].connection = connection;
    } else {
      this.logger.error(`Account not found to update macaroon`, { id });
    }
  }

  updateAccountSecret(id: string, secret: string): void {
    if (this.accounts?.[id]) {
      this.accounts[id].twofaSecret = secret;
    } else {
      this.logger.error(`Account not found to update 2FA secret`, { id });
      throw new Error('Error updating 2FA for account.');
    }
  }
}
