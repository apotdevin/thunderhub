import base64url from 'base64url';
import { v5 as uuidv5 } from 'uuid';
import { CLIENT_ACCOUNT } from '../context/AccountContext';

const THUNDERHUB_NAMESPACE = '00000000-0000-0000-0000-000000000000';

export const getUUID = (text: string): string =>
  uuidv5(text, THUNDERHUB_NAMESPACE);

export const getAccountId = (host = '', viewOnly = '', admin = '', cert = '') =>
  getUUID(`${host}-${viewOnly}-${admin !== '' ? 1 : 0}-${cert}`);

export const getAuthLnd = (lndconnect: string) => {
  const auth = lndconnect.replace('lndconnect', 'https');

  let url;

  try {
    url = new URL(auth);
  } catch (error) {
    return {
      cert: '',
      macaroon: '',
      socket: '',
    };
  }

  const cert = url.searchParams.get('cert') || '';
  const macaroon = url.searchParams.get('macaroon') || '';
  const socket = url.host;

  return {
    cert: base64url.toBase64(cert),
    macaroon: base64url.toBase64(macaroon),
    socket,
  };
};

export const getBase64CertfromDerFormat = (base64: string) => {
  if (!base64) return null;

  const prefix = '-----BEGIN CERTIFICATE-----\n';
  const postfix = '-----END CERTIFICATE-----';
  const pem = base64.match(/.{0,64}/g) || [];
  const pemString = pem.join('\n');
  const pemComplete = prefix + pemString + postfix;
  const pemText = base64url.encode(pemComplete);

  return pemText;
};

const emptyObject = {
  cert: undefined,
  admin: undefined,
  viewOnly: undefined,
  host: undefined,
};

export const getConfigLnd = (json: string) => {
  const parsedJson = JSON.parse(json);

  const config = parsedJson.configurations;

  if (config && config.length >= 1) {
    const cert = config[0].certificateThumbprint || '';
    const admin = config[0].adminMacaroon;
    const viewOnly = config[0].readonlyMacaroon;
    const host = config[0].host;
    const port = config[0].port;

    return {
      cert,
      admin,
      viewOnly,
      host: `${host}:${port}`,
    };
  }

  return emptyObject;
};

export const getQRConfig = (json: string) => {
  const config = JSON.parse(json);

  if (config) {
    const { name = '', cert = '', admin, viewOnly, host } = config;

    return {
      name,
      cert,
      admin,
      viewOnly,
      host,
    };
  }

  return { ...emptyObject, name: undefined };
};

export const getAuthObj = (
  host: string | undefined,
  viewOnly: string | undefined,
  admin: string | undefined,
  cert: string | undefined
) => {
  if (!host) {
    return null;
  }
  if (!viewOnly && !admin) {
    return null;
  }

  return {
    type: CLIENT_ACCOUNT,
    host,
    macaroon: viewOnly && viewOnly !== '' ? viewOnly : admin,
    cert,
  };
};
