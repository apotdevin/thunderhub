/* eslint @typescript-eslint/no-var-requires: 0 */
import * as React from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import getConfig from 'next/config';
import introspectionQueryResultData from 'src/graphql/fragmentTypes.json';
import { SchemaLink } from 'apollo-link-schema';
import { NextPage } from 'next';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

let globalApolloClient: ReturnType<typeof createApolloClient> | null = null;

const { publicRuntimeConfig } = getConfig();
const { apiUrl: uri } = publicRuntimeConfig;

type Context = SchemaLink.ResolverContextFunction | Record<string, any>;

function createIsomorphLink(ctx: Context) {
  if (typeof window === 'undefined') {
    const schema = require('server/schema');
    return new SchemaLink({ schema, context: ctx });
  } else {
    const { HttpLink } = require('apollo-link-http');

    return new HttpLink({
      uri,
      credentials: 'same-origin',
    });
  }
}

/**
 * Creates and configures the ApolloClient
 */
function createApolloClient(ctx: Context, initialState: NormalizedCacheObject) {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache({ fragmentMatcher }).restore(initialState);

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode,
    link: createIsomorphLink(ctx),
    cache,
  });
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
function initApolloClient(ctx: Context, initialState?: NormalizedCacheObject) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(ctx, initialState);
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(ctx, initialState);
  }

  return globalApolloClient;
}

interface WithApolloProps {
  apolloClient?: ApolloClient<NormalizedCacheObject>;
  apolloState?: NormalizedCacheObject;
}

interface WithApolloOptions {
  ssr?: boolean;
}

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 */
export function withApollo(
  PageComponent: NextPage,
  { ssr }: WithApolloOptions = { ssr: true }
) {
  const WithApollo: NextPage<WithApolloProps> = ({
    apolloClient,
    apolloState,
    ...pageProps
  }) => {
    const client = apolloClient || initApolloClient(undefined, apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx): Promise<WithApolloProps> => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = initApolloClient({
        res: ctx.res,
        req: ctx.req,
      });
      (ctx as any).apolloClient = apolloClient;

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps as WithApolloProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
}
