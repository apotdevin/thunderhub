import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { logger } from 'server/helpers/logger';
import yaml from 'js-yaml';
import bcrypt from 'bcryptjs';
import { AccountType as ContextAccountType } from 'server/types/apiTypes';
import { getUUID } from './auth';

type EncodingType = 'hex' | 'utf-8';
type BitcoinNetwork = 'mainnet' | 'regtest' | 'testnet';

type AccountType = {
  name?: string;
  serverUrl?: string;
  lndDir?: string;
  network?: BitcoinNetwork;
  macaroonPath?: string;
  certificatePath?: string;
  password?: string;
  macaroon?: string;
  certificate?: string;
};
type ParsedAccount = {
  name: string;
  id: string;
  socket: string;
  macaroon: string;
  cert: string;
  password: string;
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
    const yamlObject = yaml.safeLoad(yamlConfig);
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
    const yamlString = yaml.safeDump(config);
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

  let hashedMasterPassword = config?.masterPassword || '';

  if (
    hashedMasterPassword &&
    hashedMasterPassword.indexOf(PRE_PASS_STRING) < 0
  ) {
    hasChanged = true;
    hashedMasterPassword = `${PRE_PASS_STRING}${bcrypt.hashSync(
      hashedMasterPassword,
      12
    )}`;
  }

  cloned.masterPassword = hashedMasterPassword;

  const hashedAccounts: AccountType[] = [];

  for (let i = 0; i < config.accounts.length; i++) {
    const account: AccountType = config.accounts[i];
    if (account.password) {
      let hashedPassword = account.password;

      if (hashedPassword.indexOf(PRE_PASS_STRING) < 0) {
        hasChanged = true;
        hashedPassword = `${PRE_PASS_STRING}${bcrypt.hashSync(
          account.password,
          12
        )}`;
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
  { macaroon, macaroonPath, network, lndDir }: AccountType,
  defaultNetwork: BitcoinNetwork
): string | null => {
  if (macaroon) {
    return macaroon;
  }

  if (macaroonPath) {
    return readFile(macaroonPath);
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

export const getAccounts = (filePath: string): ContextAccountType[] => {
  if (filePath === '') {
    logger.verbose('No account config file path provided');
    return [];
  }

  const accountConfig = parseYaml(filePath);
  if (!accountConfig) {
    logger.info(`No account config file found at path ${filePath}`);
    return [];
  }
  return getAccountsFromYaml(accountConfig, filePath) as ContextAccountType[];
};

export const getParsedAccount = (
  account: AccountType,
  index: number,
  masterPassword: string | null,
  defaultNetwork: BitcoinNetwork
): ParsedAccount | null => {
  const {
    name,
    serverUrl,
    network,
    lndDir,
    macaroonPath,
    macaroon: macaroonValue,
    password,
  } = account;

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

  const cert = getCertificate(account);
  if (!cert) {
    logger.warn(
      `No certificate for account ${name}. Make sure you don't need it to connect.`
    );
  }

  const macaroon = getMacaroon(account, defaultNetwork);
  if (!macaroon) {
    logger.error(
      `Account ${name} has neither lnd directory, macaroon nor macaroon path specified.`
    );
    return null;
  }

  const id = getUUID(`${name}${serverUrl}${macaroon}${cert}`);

  return {
    name: name || '',
    id,
    socket: serverUrl || '',
    macaroon,
    cert: cert || '',
    password: password || masterPassword || '',
  };
};

export const getAccountsFromYaml = (
  config: AccountConfigType,
  filePath: string
) => {
  const { hashed, accounts: preAccounts } = config;

  if (!preAccounts || preAccounts.length <= 0) {
    logger.warn(`Account config found at path ${filePath} but had no accounts`);
    return null;
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

  return parsedAccounts;
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
