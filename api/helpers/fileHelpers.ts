import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { logger } from 'api/helpers/logger';
import os from 'os';

export const readCert = (certPath: string): string | null => {
  const certExists = fs.existsSync(certPath);

  if (!certExists) {
    logger.error(`No tls certificate file found at path: ${certPath}`);
    return null;
  } else {
    try {
      const ssoCert = fs.readFileSync(certPath, 'hex');
      return ssoCert;
    } catch (err) {
      logger.error(
        'Something went wrong while reading the tls certificate: \n' + err
      );
      return null;
    }
  }
};

export const readMacaroons = (macaroonPath: string): string | null => {
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
