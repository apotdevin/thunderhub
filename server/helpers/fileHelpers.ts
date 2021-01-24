import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { logger } from 'server/helpers/logger';
import yaml from 'js-yaml';
import { getUUID } from './auth';
import { hashPassword } from './crypto';
import { resolveEnvVarsInAccount } from './env';

type EncodingType = 'hex' | 'utf-8';
type BitcoinNetwork = 'mainnet' | 'regtest' | 'testnet';

export type AccountType = {
  name?: string;
  serverUrl?: string;
  lndDir?: string;
  network?: BitcoinNetwork;
  macaroonPath?: string;
  certificatePath?: string;
  password?: string | null;
  macaroon?: string;
  certificate?: string;
  encrypted?: boolean;
  sso?: boolean;
};

export type UnresolvedAccountType = {
  name?: string;
  serverUrl?: string;
  lndDir?: string;
  network?: BitcoinNetwork;
  macaroonPath?: string;
  certificatePath?: string;
  password?: string | null;
  macaroon?: string;
  certificate?: string;
  encrypted?: boolean | string;
};

export type ParsedAccount = {
  name: string;
  id: string;
  socket: string;
  macaroon: string;
  cert: string;
  password: string;
  sso: boolean;
} & EncryptedAccount;

type EncryptedAccount =
  | {
      encrypted: true;
      encryptedMacaroon: string;
    }
  | {
      encrypted: false;
    };

type AccountConfigType = {
  hashed: boolean | null;
  masterPassword: string | null;
  defaultNetwork: string | null;
  accounts: AccountType[];
};

const isValidNetwork = (network: string | null): network is BitcoinNetwork =>
  network === 'mainnet' || network === 'regtest' || network === 'testnet';

export const PRE_PASS_STRING = 'thunderhub-';

export const readFile = (
  filePath: string,
  encoding: EncodingType = 'hex'
): string | null => {
  if (filePath === '') {
    return null;
  }

  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
    logger.error(`No file found at path: ${filePath}`);
    return null;
  } else {
    try {
      const file = fs.readFileSync(filePath, encoding);
      return file;
    } catch (err) {
      logger.error('Something went wrong while reading the file: \n' + err);
      return null;
    }
  }
};

export const parseYaml = (filePath: string): AccountConfigType | null => {
  if (filePath === '') {
    return null;
  }

  const yamlConfig = readFile(filePath, 'utf-8');

  if (!yamlConfig) {
    return null;
  }

  try {
    const yamlObject = yaml.load(yamlConfig);
    // TODO: validate this, before returning?
    return yamlObject as AccountConfigType;
  } catch (err) {
    logger.error(
      'Something went wrong while parsing the YAML config file: \n' + err
    );
    return null;
  }
};

const saveHashedYaml = (config: AccountConfigType, filePath: string): void => {
  if (filePath === '' || !config) return;

  logger.info('Saving new yaml file with hashed passwords');

  try {
    const yamlString = yaml.dump(config);
    fs.writeFileSync(filePath, yamlString);
    logger.info('Succesfully saved');
  } catch (error) {
    logger.error(
      'Error saving yaml file with hashed passwords. Passwords are still in cleartext on your server.'
    );
  }
};

export const hashPasswords = (
  isHashed: boolean,
  config: AccountConfigType,
  filePath: string
): AccountConfigType => {
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

  hasChanged && saveHashedYaml(cloned, filePath);

  return cloned;
};

const getCertificate = ({
  certificate,
  certificatePath,
  lndDir,
}: AccountType): string | null => {
  if (certificate) {
    return certificate;
  }

  if (certificatePath) {
    return readFile(certificatePath);
  }

  if (lndDir) {
    return readFile(path.join(lndDir, 'tls.cert'));
  }

  return null;
};

const getMacaroon = (
  { macaroon, macaroonPath, network, lndDir, encrypted }: AccountType,
  defaultNetwork: BitcoinNetwork
): string | null => {
  if (macaroon) {
    return macaroon;
  }

  if (macaroonPath) {
    return readFile(macaroonPath, encrypted ? 'utf-8' : 'hex');
  }

  if (!lndDir) {
    return null;
  }

  return readFile(
    path.join(
      lndDir,
      'data',
      'chain',
      'bitcoin',
      network || defaultNetwork,
      'admin.macaroon'
    )
  );
};

export const getAccounts = (filePath: string): ParsedAccount[] => {
  if (filePath === '') {
    logger.verbose('No account config file path provided');
    return [];
  }

  const accountConfig = parseYaml(filePath);
  if (!accountConfig) {
    logger.info(`No account config file found at path ${filePath}`);
    return [];
  }
  return getAccountsFromYaml(accountConfig, filePath);
};

export const getParsedAccount = (
  account: UnresolvedAccountType,
  index: number,
  masterPassword: string | null,
  defaultNetwork: BitcoinNetwork
): ParsedAccount | null => {
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
    sso = false,
  } = resolvedAccount;

  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!serverUrl) missingFields.push('server url');
  if (!lndDir && !macaroonPath && !macaroonValue) {
    missingFields.push('macaroon');
  }

  if (missingFields.length > 0) {
    const text = missingFields.join(', ');
    logger.error(`Account in index ${index} is missing the fields ${text}`);
    return null;
  }

  if (network && !isValidNetwork(network)) {
    logger.error(`Account ${name} has invalid network: ${network}`);
    return null;
  }

  if (!password && !masterPassword) {
    logger.error(
      `You must set a password for account ${name} or set a master password`
    );
    return null;
  }

  const cert = getCertificate(resolvedAccount);
  if (!cert) {
    logger.warn(
      `No certificate for account ${name}. Make sure you don't need it to connect.`
    );
  }

  const macaroon = getMacaroon(resolvedAccount, defaultNetwork);
  if (!macaroon) {
    logger.error(
      `Account ${name} has neither lnd directory, macaroon nor macaroon path specified.`
    );
    return null;
  }

  const id = getUUID(`${name}${serverUrl}${macaroon}${cert}`);

  let encryptedProps: EncryptedAccount = {
    encrypted: false,
  };

  if (encrypted) {
    encryptedProps = {
      encrypted: true,
      encryptedMacaroon: macaroon,
    };
  }

  return {
    name: name || '',
    id,
    socket: serverUrl || '',
    macaroon,
    cert: cert || '',
    password: password || masterPassword || '',
    sso,
    ...encryptedProps,
  };
};

export const getAccountsFromYaml = (
  config: AccountConfigType,
  filePath: string
): ParsedAccount[] => {
  const { hashed, accounts: preAccounts } = config;

  if (!preAccounts || preAccounts.length <= 0) {
    logger.warn(`Account config found at path ${filePath} but had no accounts`);
    return [];
  }

  const { defaultNetwork, masterPassword, accounts } = hashPasswords(
    hashed || false,
    config,
    filePath
  );

  const network: BitcoinNetwork = isValidNetwork(defaultNetwork)
    ? defaultNetwork
    : 'mainnet';

  const parsedAccounts = accounts
    .map((account, index) =>
      getParsedAccount(account, index, masterPassword, network)
    )
    .filter(Boolean);

  logger.info(
    `Server accounts that will be available: ${parsedAccounts
      .map(account => account?.name)
      .join(', ')}`
  );

  return parsedAccounts as ParsedAccount[];
};

export const readMacaroons = (macaroonPath: string): string | null => {
  if (macaroonPath === '') {
    logger.verbose('No macaroon path provided');
    return null;
  }

  const adminExists = fs.existsSync(`${macaroonPath}/admin.macaroon`);

  if (!adminExists) {
    logger.error(
      `No admin.macaroon file found at path: ${macaroonPath}/admin.macaroon`
    );
    return null;
  } else {
    try {
      const ssoAdmin = fs.readFileSync(`${macaroonPath}/admin.macaroon`, 'hex');
      return ssoAdmin;
    } catch (err) {
      logger.error(
        'Something went wrong while reading the admin.macaroon: \n' + err
      );
      return null;
    }
  }
};

export const createDirectory = (dirname: string) => {
  const initDir = path.isAbsolute(dirname) ? path.sep : '';
  dirname.split(path.sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    try {
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }
    } catch (err) {
      if (err.code !== 'EEXIST') {
        if (err.code === 'ENOENT') {
          throw new Error(
            `ENOENT: No such file or directory, mkdir '${dirname}'. Ensure that path separator is '${
              os.platform() === 'win32' ? '\\\\' : '/'
            }'`
          );
        } else {
          throw err;
        }
      }
    }
    return curDir;
  }, initDir);
};

export const readCookie = (cookieFile: string): string | null => {
  if (cookieFile === '') {
    logger.verbose('No cookie path provided');
    return null;
  }

  const exists = fs.existsSync(cookieFile);
  if (exists) {
    try {
      logger.verbose(`Found cookie at path ${cookieFile}`);
      const cookie = fs.readFileSync(cookieFile, 'utf-8');
      return cookie;
    } catch (err) {
      logger.error('Something went wrong while reading cookie: \n' + err);
      throw new Error(err);
    }
  } else {
    try {
      const dirname = path.dirname(cookieFile);
      createDirectory(dirname);
      fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));

      logger.info(`Cookie created at directory: ${dirname}`);

      const cookie = fs.readFileSync(cookieFile, 'utf-8');
      return cookie;
    } catch (err) {
      logger.error('Something went wrong while reading the cookie: \n' + err);
      throw new Error(err);
    }
  }
};

export const refreshCookie = (cookieFile: string) => {
  try {
    logger.verbose('Refreshing cookie for next authentication');
    fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));
  } catch (err) {
    logger.error('Something went wrong while refreshing cookie: \n' + err);
    throw new Error(err);
  }
};
