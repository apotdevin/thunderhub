import { Agent } from 'https';
import getConfig from 'next/config';
import { SocksProxyAgent } from 'socks-proxy-agent';
import fetch from 'node-fetch';
import { GraphQLError } from 'graphql';
import { logger } from 'server/helpers/logger';

const { serverRuntimeConfig } = getConfig() || { serverRuntimeConfig: {} };
const { torProxy } = serverRuntimeConfig;

let agent: Agent | null = null;

if (torProxy) {
  logger.info(`Using tor proxy for external requests: ${torProxy}`);
  agent = new SocksProxyAgent(torProxy) as any;
}

export const fetchWithProxy = (url: string, options?: {}) => {
  return agent ? fetch(url, { agent, ...options }) : fetch(url, options);
};

export const graphqlFetchWithProxy = async (
  url: string,
  query: string,
  variables?: { [key: string]: string | number | string[] | boolean },
  headers?: { [key: string]: string | number | string[] | boolean }
): Promise<{
  data: any;
  error: undefined | GraphQLError;
}> => {
  return fetchWithProxy(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify({ query, variables }),
  })
    .then(res => res.json() as any)
    .then(result => {
      const { data, errors } = result;
      return {
        data,
        error: errors?.[0]?.message,
      };
    })
    .catch(error => {
      logger.error('Error doing graphql fetch: %o', error);
      return { data: undefined, error };
    });
};
