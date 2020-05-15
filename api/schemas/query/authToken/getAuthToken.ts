import { GraphQLBoolean, GraphQLString } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { logger } from 'api/helpers/logger';
import getConfig from 'next/config';
import os from 'os';
import jwt from 'jsonwebtoken';
import { SSO_USER } from 'src/utils/auth';

const createDirectory = (dirname: string) => {
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
            `ENOENT: No such file or directory, mkdir '${dirname}'. Ensure that channel backup path separator is '${
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

const readCookie = (cookieFile: string): string => {
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

const refreshCookie = (cookieFile: string) => {
  try {
    fs.writeFileSync(cookieFile, crypto.randomBytes(64).toString('hex'));
  } catch (err) {
    logger.error('Something went wrong while refreshing cookie: \n' + err);
    throw new Error(err);
  }
};

const { serverRuntimeConfig } = getConfig();
const {
  cookiePath,
  lnServerUrl,
  lnCertPath,
  macaroonPath,
} = serverRuntimeConfig;

export const getAuthToken = {
  type: GraphQLString,
  args: {
    cookie: { type: GraphQLString },
  },
  resolve: async (root: any, params: any, context: any) => {
    const { ip, secret } = context;
    await requestLimiter(ip, 'setup');

    if (!params.cookie) {
      return null;
    }

    const cookieFile = readCookie(cookiePath);

    // refreshCookie(cookiePath);

    // console.log('Cookie in file: ', {
    //   cookieFile,
    //   param: params.cookie,
    //   secret,
    // });

    if (cookieFile === params.cookie) {
      const token = jwt.sign(
        { user: SSO_USER, lnServerUrl, lnCertPath, macaroonPath },
        secret
      );

      // console.log('Created token: ', { token });
      return token;
    }

    return null;
  },
};
