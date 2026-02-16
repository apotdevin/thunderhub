interface ThunderhubConfig {
  apiUrl: string;
  basePath: string;
  mempoolUrl: string;
  defaultTheme: string;
  defaultCurrency: string;
  fetchPrices: boolean;
  fetchFees: boolean;
  disableLinks: boolean;
  disableLnMarkets: boolean;
  noVersionCheck: boolean;
  logoutUrl: string;
  disable2FA: boolean;
  npmVersion: string;
}

declare global {
  interface Window {
    __THUNDERHUB_CONFIG__?: Partial<ThunderhubConfig>;
  }
}

const win =
  typeof window !== 'undefined' ? window.__THUNDERHUB_CONFIG__ || {} : {};

export const config: ThunderhubConfig = {
  apiUrl:
    win.apiUrl ??
    import.meta.env.VITE_API_URL ??
    `${import.meta.env.VITE_BASE_PATH || ''}/graphql`,
  basePath: win.basePath ?? import.meta.env.VITE_BASE_PATH ?? '',
  mempoolUrl:
    win.mempoolUrl ??
    import.meta.env.VITE_MEMPOOL_URL ??
    'https://mempool.space',
  defaultTheme: win.defaultTheme ?? import.meta.env.VITE_THEME ?? 'dark',
  defaultCurrency:
    win.defaultCurrency ?? import.meta.env.VITE_CURRENCY ?? 'sat',
  fetchPrices:
    win.fetchPrices ??
    (import.meta.env.VITE_FETCH_PRICES === 'false' ? false : true),
  fetchFees:
    win.fetchFees ??
    (import.meta.env.VITE_FETCH_FEES === 'false' ? false : true),
  disableLinks:
    win.disableLinks ?? import.meta.env.VITE_DISABLE_LINKS === 'true',
  disableLnMarkets:
    win.disableLnMarkets ?? import.meta.env.VITE_DISABLE_LNMARKETS === 'true',
  noVersionCheck:
    win.noVersionCheck ?? import.meta.env.VITE_NO_VERSION_CHECK === 'true',
  logoutUrl: win.logoutUrl ?? import.meta.env.VITE_LOGOUT_URL ?? '',
  disable2FA: win.disable2FA ?? import.meta.env.VITE_DISABLE_TWOFA === 'true',
  npmVersion: win.npmVersion ?? import.meta.env.VITE_NPM_VERSION ?? '0.0.0',
};
