/* eslint @typescript-eslint/no-var-requires: 0 */
import { IncomingMessage, ServerResponse } from 'http';
import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { apiUrl: uri } = publicRuntimeConfig;

let apolloClient: ReturnType<typeof createApolloClient> | null = null;

function createIsomorphLink(req?: IncomingMessage, res?: ServerResponse) {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('server/schema');
    const { getContext } = require('server/schema/context');
    return new SchemaLink({
      schema,
      context: req && res ? getContext(req, res) : {},
    });
  } else {
    const { HttpLink } = require('@apollo/client/link/http');
    return new HttpLink({
      uri,
      credentials: 'same-origin',
    });
  }
}

function createApolloClient(req?: IncomingMessage, res?: ServerResponse) {
  return new ApolloClient({
    credentials: 'same-origin',
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(req, res),
    cache: new InMemoryCache({
      possibleTypes: { Transaction: ['InvoiceType', 'PaymentType'] },
    }),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  req?: IncomingMessage,
  res?: ServerResponse
) {
  const _apolloClient = apolloClient ?? createApolloClient(req, res);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
