import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { logger } from 'server/helpers/logger';
import yaml from 'js-yaml';
import { getUUID } from 'src/utils/auth';
import bcrypt from 'bcryptjs';

type EncodingType = 'hex' | 'utf-8';

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

type AccountType = {
  name: string;
  serverUrl: string;
  macaroonPath: string;
  certificatePath: string;
  password: string | null;
  macaroon: string;
  certificate: string;
};

type AccountConfigType = {
  hashed: boolean | null;
  masterPassword: string | null;
  accounts: AccountType[];
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
    return yamlObject;
  } catch (err) {
    logger.error(
      'Something went wrong while parsing the YAML config file: \n' + err
    );
    return null;
  }
};

export const saveHashedYaml = (
  config: AccountConfigType,
  filePath: string
): void => {
  if (filePath === '' || !config) return;

  logger.info('Saving new yaml file with hashed passwords');

  try {
    const yamlString = yaml.safeDump({ hashed: true, ...config });
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

  const cloned = { ...config };

  cloned.masterPassword = bcrypt.hashSync(config.masterPassword, 12);

  const hashedAccounts: AccountType[] = [];

  for (let i = 0; i < config.accounts.length; i++) {
    const account: AccountType = config.accounts[i];
    if (account.password) {
      const hashedPassword = bcrypt.hashSync(account.password, 12);
      hashedAccounts.push({ ...account, password: hashedPassword });
    } else {
      hashedAccounts.push(account);
    }
  }

  cloned.accounts = hashedAccounts;

  saveHashedYaml(cloned, filePath);

  return cloned;
};

export const getAccounts = (filePath: string) => {
  if (filePath === '') {
    logger.verbose('No account config file path provided');
    return null;
  }

  const accountConfig = parseYaml(filePath);

  if (!accountConfig) {
    logger.info(`No account config file found at path ${filePath}`);
    return null;
  }

  const { hashed, accounts: preAccounts } = accountConfig;

  if (!preAccounts || preAccounts.length <= 0) {
    logger.warn(`Account config found at path ${filePath} but had no accounts`);
    return null;
  }

  const { masterPassword, accounts } = hashPasswords(
    hashed,
    accountConfig,
    filePath
  );

  const readAccounts = [];

  const parsedAccounts = accounts
    .map((account, index) => {
      const {
        name,
        serverUrl,
        macaroonPath,
        certificatePath,
        macaroon: macaroonValue,
        certificate,
        password,
      } = account;

      const missingFields: string[] = [];
      if (!name) missingFields.push('name');
      if (!serverUrl) missingFields.push('server url');
      if (!macaroonPath && !macaroonValue) missingFields.push('macaroon');

      if (missingFields.length > 0) {
        const text = missingFields.join(', ');
        logger.error(`Account in index ${index} is missing the fields ${text}`);
        return null;
      }

      if (!password && !masterPassword) {
        logger.error(
          `You must set a password for account ${name} or set a master password`
        );
        return null;
      }

      if (!certificatePath && !certificate)
        logger.warn(
          `No certificate for account ${name}. Make sure you don't need it to connect.`
        );

      const cert = certificate
        ? certificate
        : (certificatePath && readFile(certificatePath)) || null;
      const macaroon = macaroonValue ? macaroonValue : readFile(macaroonPath);

      if (certificatePath && !cert)
        logger.warn(
          `No certificate for account ${name}. Make sure you don't need it to connect.`
        );

      if (!macaroon) {
        logger.error(`No macarron found for account ${name}.`);
        return null;
      }

      const id = getUUID(`${name}${serverUrl}${macaroon}${cert}`);

      readAccounts.push(name);

      return {
        name,
        id,
        host: serverUrl,
        macaroon,
        cert,
        password: password || masterPassword,
      };
    })
    .filter(Boolean);

  const allAccounts = readAccounts.join(', ');
  logger.info(`Server accounts that will be available: ${allAccounts}`);

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
