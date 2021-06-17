/* eslint @typescript-eslint/no-var-requires: 0 */
import { IncomingMessage, ServerResponse } from 'http';
import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import getConfig from 'next/config';
import possibleTypes from 'src/graphql/fragmentTypes.json';

const { publicRuntimeConfig } = getConfig();
const { apiUrl: uri } = publicRuntimeConfig;

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export type ResolverContext = {
  req?: IncomingMessage;
  res?: ServerResponse;
};

function createIsomorphLink(context: ResolverContext = {}) {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('server/schema');
    const { getContext } = require('server/schema/context');
    return new SchemaLink({
      schema,
      context: getContext(context),
    });
  } else {
    const { HttpLink } = require('@apollo/client/link/http');
    return new HttpLink({
      uri,
      credentials: 'same-origin',
    });
  }
}

function createApolloClient(context?: ResolverContext) {
  return new ApolloClient({
    credentials: 'same-origin',
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(context),
    cache: new InMemoryCache({
      ...possibleTypes,
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  context?: ResolverContext
) {
  const _apolloClient = apolloClient ?? createApolloClient(context);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
