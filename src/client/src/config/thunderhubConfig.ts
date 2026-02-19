interface ThunderhubConfig {
  apiUrl: string;
  basePath: string;
  mempoolUrl: string;
  defaultTheme: string;
  defaultCurrency: string;
  fetchPrices: boolean;
  fetchFees: boolean;
  disableLinks: boolean;
  noVersionCheck: boolean;
  logoutUrl: string;
  disable2FA: boolean;
  npmVersion: string;
}

export const config: ThunderhubConfig = {
  apiUrl: '/graphql',
  basePath: '',
  mempoolUrl: 'https://mempool.space',
  defaultTheme: 'dark',
  defaultCurrency: 'sat',
  fetchPrices: true,
  fetchFees: true,
  disableLinks: false,
  noVersionCheck: false,
  logoutUrl: '',
  disable2FA: false,
  npmVersion: '0.0.1',
};

export function initConfig(data: Partial<ThunderhubConfig>): void {
  Object.assign(config, data);
}
