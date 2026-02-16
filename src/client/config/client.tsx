import { useMemo } from 'react';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { config } from '../src/config/thunderhubConfig';
import possibleTypes from '../src/graphql/fragmentTypes.json';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient(authToken: string) {
  const httpLink = createHttpLink({
    uri: config.apiUrl,
    credentials: 'include',
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    };
  });

  const link = from([
    onError(({ graphQLErrors, networkError }) => {
      if (process.env.NODE_ENV === 'production') return;
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    authLink.concat(httpLink),
  ]);

  return new ApolloClient({
    credentials: 'same-origin',
    ssrMode: false,
    link,
    cache: new InMemoryCache({
      ...possibleTypes,
      typePolicies: {
        Query: {
          fields: {
            getInvoices: {
              keyArgs: false,
              merge(existing = { next: '', invoices: [] }, incoming) {
                return {
                  next: incoming.next,
                  invoices: [...existing.invoices, ...incoming.invoices],
                };
              },
            },
            getPayments: {
              keyArgs: false,
              merge(existing = { next: '', payments: [] }, incoming) {
                return {
                  next: incoming.next,
                  payments: [...existing.payments, ...incoming.payments],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  });
}

export function initializeApollo(
  authToken: string,
  initialState: NormalizedCacheObject | null = null
) {
  const _apolloClient = apolloClient ?? createApolloClient(authToken);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(
  authToken: string,
  initialState: NormalizedCacheObject | null
) {
  const store = useMemo(
    () => initializeApollo(authToken, initialState),
    [authToken, initialState]
  );
  return store;
}
