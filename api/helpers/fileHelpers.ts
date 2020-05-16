import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { logger } from 'api/helpers/logger';
import yaml from 'js-yaml';
import AES from 'crypto-js/aes';
import { getUUID } from 'src/utils/auth';

export const readFile = (filePath: string, encoding = 'hex'): string | null => {
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
};

type AccountConfigType = {
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

export const getAccounts = (filePath: string) => {
  if (filePath === '') {
    return null;
  }

  const accountConfig = parseYaml(filePath);

  if (!accountConfig) {
    return null;
  }

  const { masterPassword, accounts } = accountConfig;

  if (!accounts || accounts.length <= 0) {
    return null;
  }

  const parsedAccounts = accounts
    .map((account, index) => {
      const {
        name,
        serverUrl,
        macaroonPath,
        certificatePath,
        password,
      } = account;
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!serverUrl) missingFields.push('server url');
      if (!macaroonPath) missingFields.push('macaroon path');
      if (missingFields.length > 0) {
        const text = missingFields.join(', ');
        logger.error(`Account in index ${index} is missing the fields ${text}`);
        return null;
      }
      if (!certificatePath)
        logger.warn(
          `No certificate for account ${name}. Make sure you don't need it to connect.`
        );

      const cert = readFile(certificatePath);
      const clearMacaroon = readFile(macaroonPath);

      if (!clearMacaroon) return null;

      const macaroon = AES.encrypt(
        clearMacaroon,
        password || masterPassword
      ).toString();

      const id = getUUID(`${name}${serverUrl}${clearMacaroon}${cert}`);

      return {
        name,
        id,
        host: serverUrl,
        macaroon,
        cert,
      };
    })
    .filter(Boolean);

  return parsedAccounts;
};

export const readMacaroons = (macaroonPath: string): string | null => {
  if (macaroonPath === '') {
    return null;
  }

  const adminExists = fs.existsSync(`${macaroonPath}admin.macaroon`);

  if (!adminExists) {
    logger.error(`No admin.macaroon file found at path: ${macaroonPath}`);
    return null;
  } else {
    try {
      const ssoAdmin = fs.readFileSync(`${macaroonPath}admin.macaroon`, 'hex');
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

export const readCookie = (cookieFile: string): string => {
  if (cookieFile === '') {
    return null;
  }

  const exists = fs.existsSync(cookieFile);
  if (exists) {
    try {
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
    fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));
  } catch (err) {
    logger.error('Something went wrong while refreshing cookie: \n' + err);
    throw new Error(err);
  }
};