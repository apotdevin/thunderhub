import { authenticatedLndGrpc } from 'ln-service';
import getConfig from 'next/config';
import {
  SSO_ACCOUNT,
  SERVER_ACCOUNT,
  AuthType,
  CLIENT_ACCOUNT,
} from 'src/context/AccountContext';
import { ContextType } from 'server/types/apiTypes';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { logger } from './logger';

const testHost = '127.0.0.1:10003';
const testMacaroon =
  '0201036c6e6402eb01030a10305de0f098e75e32012b7143d18310eb1201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a140a086d616361726f6f6e120867656e65726174651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a180a067369676e6572120867656e657261746512047265616400000620ff9f467796b44c45e35db96e4ab2d2882d69d45595f28b01ed41d29d88c4811a';
const testCert =
  '2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d494942346a4343415969674177494241674952414c4d4f457a53484f576f644b374d54504d6a41344b5577436759494b6f5a497a6a3045417749774d5445660a4d4230474131554543684d576247356b494746316447396e5a57356c636d46305a575167593256796444454f4d4177474131554541784d4659324679623277770a4868634e4d6a41774e5449354d54497a4e6a41345768634e4d6a45774e7a49304d54497a4e6a4134576a41784d523877485159445651514b45785a73626d51670a595856306232646c626d56795958526c5a43426a5a584a304d51347744415944565151444577566a59584a766244425a4d424d4742797147534d3439416745470a43437147534d343941774548413049414247414e6d6d4b714e46554669585055513070326c654e6b72664b376e52524a6a6f32593257344144595868634132750a5930704f4461773147716f70796c6f5947504b486c5468716b68746e7768776f595634774c61716a67594177666a414f42674e56485138424166384542414d430a4171517744775944565230544151482f42415577417745422f7a426242674e5648524545564442536767566a59584a766249494a6247396a5957786f62334e300a6767566a59584a7662494945645735706549494b64573570654842685932746c64494948596e566d59323975626f6345667741414159635141414141414141410a4141414141414141414141414159634572426741426a414b42676771686b6a4f5051514441674e494144424641694541382f4c326778567354434a536f3934310a4b3859714f31334b7a4e687570345338483158534a31566b4a76384349425439586d504332674247486b6c5233446b4632467068324e6d6e6b772b524e7a6e4e0a6832314d3453624e0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a';

const { serverRuntimeConfig } = getConfig();
const { nodeEnv } = serverRuntimeConfig;

type LndAuthType = {
  cert: string;
  macaroon: string;
  host: string;
};

export const getIp = (req: any) => {
  if (!req || !req.headers) {
    return '';
  }
  const forwarded = req.headers['x-forwarded-for'];
  const before = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ip = nodeEnv === 'development' ? '1.2.3.4' : before;
  return ip;
};

export const getCorrectAuth = (
  auth: AuthType,
  context: ContextType
): LndAuthType => {
  if (auth.type === 'test' && nodeEnv === 'development') {
    return {
      host: testHost,
      macaroon: testMacaroon,
      cert: testCert,
    };
  }
  if (auth.type === SERVER_ACCOUNT) {
    const { account, accounts } = context;
    if (!account) {
      logger.debug('Account not available in request');
      throw new Error('AccountNotAuthenticated');
    }
    if (account.id !== auth.id) {
      logger.debug(
        `Account (${account.id}) in cookie different to requested account (${auth.id})`
      );
      throw new Error('AccountNotAuthenticated');
    }

    const verifiedAccount = accounts.find(a => a.id === account.id) || null;

    if (!verifiedAccount) {
      logger.debug('Account not found in config file');
      throw new Error('AccountNotAuthenticated');
    }

    let macaroon = null;
    try {
      const bytes = AES.decrypt(verifiedAccount.macaroon, account.password);
      macaroon = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      logger.warn('Account macaroon verification failed');
    }

    return { host: verifiedAccount.host, macaroon, cert: verifiedAccount.cert };
  }
  if (auth.type === SSO_ACCOUNT) {
    if (!context.ssoVerified) {
      logger.debug('SSO Account is not verified');
      throw new Error('AccountNotAuthenticated');
    }

    return { ...context.sso };
  }
  if (auth.type === CLIENT_ACCOUNT) {
    const { host, macaroon, cert } = auth;
    return { host, macaroon, cert };
  }
  throw new Error('AccountTypeDoesNotExist');
};

export const getAuthLnd = (auth: LndAuthType) => {
  const cert = auth.cert || '';
  const macaroon = auth.macaroon || '';
  const socket = auth.host || '';

  const params = {
    macaroon,
    socket,
    ...(cert !== '' ? { cert } : {}),
  };

  const { lnd } = authenticatedLndGrpc(params);

  return lnd;
};

export const getErrorMsg = (error: any[] | string): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error.length >= 2) {
    return error[1];
  }
  // if (error.length > 2) {
  //   return error[2].err?.message || 'Error';
  // }

  return 'Error';
};
