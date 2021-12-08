import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { ConfigService } from '@nestjs/config';
import {
  AccountConfigType,
  AccountType,
  BitcoinNetwork,
  EncodingType,
  ParsedAccount,
  UnresolvedAccountType,
} from './files.types';
import yaml from 'js-yaml';
import { getSHA256Hash, hashPassword } from 'src/server/utils/crypto';
import { resolveEnvVarsInAccount } from 'src/server/utils/env';

const isValidNetwork = (network: string | null): network is BitcoinNetwork =>
  network === 'mainnet' || network === 'regtest' || network === 'testnet';

export const PRE_PASS_STRING = 'thunderhub-';

@Injectable()
export class FilesService {
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  readFile(filePath: string, encoding: EncodingType = 'hex'): string | null {
    if (filePath === '') {
      return null;
    }

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      this.logger.error(`No file found at path: ${filePath}`);
      return null;
    } else {
      try {
        const file = fs.readFileSync(filePath, encoding);
        return file;
      } catch (error: any) {
        this.logger.error(
          `Something went wrong while reading the file at path ${filePath}:` +
            error
        );
        return null;
      }
    }
  }

  parseYaml(filePath: string): AccountConfigType | null {
    if (filePath === '') {
      return null;
    }

    const yamlConfig = this.readFile(filePath, 'utf-8');

    if (!yamlConfig) {
      return null;
    }

    try {
      const yamlObject = yaml.load(yamlConfig);
      // TODO: validate this, before returning?
      return yamlObject as AccountConfigType;
    } catch (error: any) {
      this.logger.error(
        'Something went wrong while parsing the YAML config file: \n' + error
      );
      return null;
    }
  }

  saveHashedYaml = (config: AccountConfigType, filePath: string): void => {
    if (filePath === '' || !config) return;

    this.logger.info('Saving new yaml file with hashed passwords');

    try {
      const yamlString = yaml.dump(config);
      fs.writeFileSync(filePath, yamlString);
      this.logger.info('Succesfully saved');
    } catch (error: any) {
      this.logger.error(
        'Error saving yaml file with hashed passwords. Passwords are still in cleartext on your server.'
      );
    }
  };

  hashPasswords(
    isHashed: boolean,
    config: AccountConfigType,
    filePath: string
  ): AccountConfigType {
    // Return early when passwords are already hashed
    if (isHashed) return config;

    let hasChanged = false;

    const cloned = { ...config };

    let hashedMasterPassword = config?.masterPassword;

    if (
      hashedMasterPassword &&
      hashedMasterPassword.indexOf(PRE_PASS_STRING) < 0
    ) {
      hasChanged = true;
      hashedMasterPassword = hashPassword(hashedMasterPassword);
    }

    cloned.masterPassword = hashedMasterPassword;

    const hashedAccounts: AccountType[] = [];

    for (let i = 0; i < config.accounts.length; i++) {
      const account: AccountType = config.accounts[i];
      if (account.password) {
        let hashedPassword = account.password;

        if (hashedPassword.indexOf(PRE_PASS_STRING) < 0) {
          hasChanged = true;
          hashedPassword = hashPassword(account.password);
        }

        hashedAccounts.push({ ...account, password: hashedPassword });
      } else {
        hashedAccounts.push(account);
      }
    }

    cloned.accounts = hashedAccounts;

    hasChanged && this.saveHashedYaml(cloned, filePath);

    return cloned;
  }

  getCertificate({
    certificate,
    certificatePath,
    lndDir,
  }: AccountType): string | null {
    if (certificate) {
      return certificate;
    }

    if (certificatePath) {
      return this.readFile(certificatePath);
    }

    if (lndDir) {
      return this.readFile(path.join(lndDir, 'tls.cert'));
    }

    return null;
  }

  getMacaroon(
    { macaroon, macaroonPath, network, lndDir, encrypted }: AccountType,
    defaultNetwork: BitcoinNetwork
  ): string | null {
    if (macaroon) {
      return macaroon;
    }

    if (macaroonPath) {
      return this.readFile(macaroonPath, encrypted ? 'utf-8' : 'hex');
    }

    if (!lndDir) {
      return null;
    }

    return this.readFile(
      path.join(
        lndDir,
        'data',
        'chain',
        'bitcoin',
        network || defaultNetwork,
        'admin.macaroon'
      )
    );
  }

  getAccounts(filePath: string): ParsedAccount[] {
    if (filePath === '') {
      this.logger.verbose('No account config file path provided');
      return [];
    }

    const accountConfig = this.parseYaml(filePath);
    if (!accountConfig) {
      this.logger.info(`No account config file found at path ${filePath}`);
      return [];
    }
    return this.getAccountsFromYaml(accountConfig, filePath);
  }

  getParsedAccount(
    account: UnresolvedAccountType,
    index: number,
    masterPassword: string | null,
    defaultNetwork: BitcoinNetwork
  ): ParsedAccount | null {
    const resolvedAccount = resolveEnvVarsInAccount(account);

    const {
      name,
      serverUrl,
      network,
      lndDir,
      macaroonPath,
      macaroon: macaroonValue,
      password,
      encrypted,
    } = resolvedAccount;

    const missingFields: string[] = [];
    if (!name) missingFields.push('name');
    if (!serverUrl) missingFields.push('server url');
    if (!lndDir && !macaroonPath && !macaroonValue) {
      missingFields.push('macaroon');
    }

    if (missingFields.length > 0) {
      const text = missingFields.join(', ');
      this.logger.error(
        `Account in index ${index} is missing the fields ${text}`
      );
      return null;
    }

    if (network && !isValidNetwork(network)) {
      this.logger.error(`Account ${name} has invalid network: ${network}`);
      return null;
    }

    if (!password && !masterPassword) {
      this.logger.error(
        `You must set a password for account ${name} or set a master password`
      );
      return null;
    }

    const cert = this.getCertificate(resolvedAccount);
    if (!cert) {
      this.logger.warn(
        `No certificate for account ${name}. Make sure you don't need it to connect.`
      );
    }

    const macaroon = this.getMacaroon(resolvedAccount, defaultNetwork);
    if (!macaroon) {
      this.logger.error(
        `Account ${name} has neither lnd directory, macaroon nor macaroon path specified.`
      );
      return null;
    }

    const hash = getSHA256Hash(
      JSON.stringify({ name, serverUrl, macaroon, cert })
    );

    const encryptedProps = encrypted
      ? { encrypted: true, encryptedMacaroon: macaroon }
      : { encrypted: false, encryptedMacaroon: '' };

    return {
      name: name || '',
      socket: serverUrl || '',
      hash,
      macaroon,
      cert: cert || '',
      password: password || masterPassword || '',
      ...encryptedProps,
    };
  }

  getAccountsFromYaml(
    config: AccountConfigType,
    filePath: string
  ): ParsedAccount[] {
    const { hashed, accounts: preAccounts } = config;

    if (!preAccounts || preAccounts.length <= 0) {
      this.logger.warn(
        `Account config found at path ${filePath} but had no accounts`
      );
      return [];
    }

    const { defaultNetwork, masterPassword, accounts } = this.hashPasswords(
      hashed || false,
      config,
      filePath
    );

    const network: BitcoinNetwork = isValidNetwork(defaultNetwork)
      ? defaultNetwork
      : 'mainnet';

    const parsedAccounts = accounts
      .map((account, index) =>
        this.getParsedAccount(account, index, masterPassword, network)
      )
      .filter(Boolean);

    this.logger.info(
      `Server accounts that will be available: ${parsedAccounts
        .map(account => account?.name)
        .join(', ')}`
    );

    return parsedAccounts as ParsedAccount[];
  }

  readMacaroons(macaroonPath: string): string | null {
    if (macaroonPath === '') {
      this.logger.verbose('No macaroon path provided');
      return null;
    }

    const adminExists = fs.existsSync(`${macaroonPath}/admin.macaroon`);

    if (!adminExists) {
      this.logger.error(
        `No admin.macaroon file found at path: ${macaroonPath}/admin.macaroon`
      );
      return null;
    } else {
      try {
        const ssoAdmin = fs.readFileSync(
          `${macaroonPath}/admin.macaroon`,
          'hex'
        );
        return ssoAdmin;
      } catch (error: any) {
        this.logger.error(
          'Something went wrong while reading the admin.macaroon: \n' + error
        );
        return null;
      }
    }
  }

  createDirectory(dirname: string) {
    const initDir = path.isAbsolute(dirname) ? path.sep : '';
    dirname.split(path.sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      try {
        if (!fs.existsSync(curDir)) {
          fs.mkdirSync(curDir);
        }
      } catch (error: any) {
        if (error.code !== 'EEXIST') {
          if (error.code === 'ENOENT') {
            throw new Error(
              `ENOENT: No such file or directory, mkdir '${dirname}'. Ensure that path separator is '${
                os.platform() === 'win32' ? '\\\\' : '/'
              }'`
            );
          } else {
            throw error;
          }
        }
      }
      return curDir;
    }, initDir);
  }

  readCookie(): string | null {
    const cookieFile = this.configService.get('cookiePath');

    if (cookieFile === '') {
      this.logger.verbose('No cookie path provided');
      return null;
    }

    const exists = fs.existsSync(cookieFile);
    if (exists) {
      try {
        this.logger.verbose(`Found cookie at path ${cookieFile}`);
        const cookie = fs.readFileSync(cookieFile, 'utf-8');
        return cookie;
      } catch (error: any) {
        this.logger.error(
          'Something went wrong while reading cookie: \n' + error
        );
        throw new Error(error);
      }
    } else {
      try {
        const dirname = path.dirname(cookieFile);
        this.createDirectory(dirname);
        fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));

        this.logger.info(`Cookie created at directory: ${dirname}`);

        const cookie = fs.readFileSync(cookieFile, 'utf-8');
        return cookie;
      } catch (error: any) {
        this.logger.error(
          'Something went wrong while reading the cookie: \n' + error
        );
        throw new Error(error);
      }
    }
  }

  refreshCookie() {
    const cookieFile = this.configService.get('cookiePath');

    if (cookieFile === '') {
      this.logger.verbose('No cookie path provided');
      return null;
    }

    try {
      this.logger.verbose('Refreshing cookie for next authentication');
      fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));
    } catch (error: any) {
      this.logger.error(
        'Something went wrong while refreshing cookie: \n' + error
      );
      throw new Error(error);
    }
  }
}
