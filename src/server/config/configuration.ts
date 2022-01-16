import crypto from 'crypto';

type SSOConfig = {
  serverUrl: string;
  certPath: string;
  macaroonPath: string;
  dangerousNoSSOAuth: boolean;
};

type Throttler = {
  ttl: number;
  limit: number;
};

type Urls = {
  mempool: string;
  amboss: string;
  tbase: string;
  ticker: string;
  fees: string;
  boltz: string;
  github: string;
  lnMarkets: string;
  lnMarketsExchange: string;
};

export type YamlEnvs = {
  YML_ENV_1: string;
  YML_ENV_2: string;
  YML_ENV_3: string;
  YML_ENV_4: string;
};

type ConfigType = {
  basePath: string;
  isProduction: boolean;
  logJson: boolean;
  playground: boolean;
  logLevel: string;
  jwtSecret: string;
  cookiePath: string;
  accountConfigPath: string;
  torProxy: string;
  sso: SSOConfig;
  throttler: Throttler;
  urls: Urls;
  yamlEnvs: YamlEnvs;
  masterPasswordOverride: string;
  disable2FA: boolean;
};

export default (): ConfigType => {
  const isProduction = process.env.NODE_ENV === 'production';

  const jwtSecret = isProduction
    ? crypto.randomBytes(64).toString('hex')
    : '123456789';

  console.log(
    `Getting ${isProduction ? 'production' : 'development'} env variables.`
  );

  const amboss =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/graphql'
      : 'https://api.amboss.space/graphql';

  const mempool = process.env.MEMPOOL_URL || 'https://mempool.space';

  const urls: Urls = {
    mempool,
    fees: `${mempool}/api/v1/fees/recommended`,
    amboss,
    tbase: 'https://api.thunderbase.io/v1',
    ticker: 'https://blockchain.info/ticker',
    github: 'https://api.github.com/repos/apotdevin/thunderhub/releases/latest',
    lnMarkets: 'https://api.lnmarkets.com/v1',
    lnMarketsExchange: 'https://lnmarkets.com',
    boltz: 'https://boltz.exchange/api',
  };

  const sso = {
    serverUrl: process.env.SSO_SERVER_URL || '',
    certPath: process.env.SSO_CERT_PATH || '',
    macaroonPath: process.env.SSO_MACAROON_PATH || '',
    dangerousNoSSOAuth: process.env.DANGEROUS_NO_SSO_AUTH === 'true',
  };

  const throttler = {
    ttl: Number(process.env.THROTTLE_TTL) || 10,
    limit: Number(process.env.THROTTLE_LIMIT) || 10,
  };

  const yamlEnvs = {
    YML_ENV_1: process.env.YML_ENV_1 || '',
    YML_ENV_2: process.env.YML_ENV_2 || '',
    YML_ENV_3: process.env.YML_ENV_3 || '',
    YML_ENV_4: process.env.YML_ENV_4 || '',
  };

  const config: ConfigType = {
    isProduction,
    logJson: process.env.LOG_JSON === 'true',
    masterPasswordOverride: process.env.MASTER_PASSWORD_OVERRIDE || '',
    disable2FA: process.env.DISABLE_TWOFA === 'true',
    basePath: process.env.BASE_PATH || '',
    playground: !isProduction,
    logLevel: process.env.LOG_LEVEL,
    cookiePath: process.env.COOKIE_PATH || '',
    accountConfigPath: process.env.ACCOUNT_CONFIG_PATH || '',
    torProxy: process.env.TOR_PROXY_SERVER || '',
    throttler,
    sso,
    urls,
    jwtSecret,
    yamlEnvs,
  };

  if (!isProduction) {
    console.log(config);
  }

  return config;
};
