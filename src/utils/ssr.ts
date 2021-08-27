import { NextPageContext } from 'next';
import { initializeApollo } from 'config/client';
import { parseCookies } from 'src/utils/cookies';
import { DocumentNode } from 'graphql';
import { appConstants } from 'server/utils/appConstants';
import { GET_AUTH_TOKEN } from 'src/graphql/mutations/getAuthToken';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl, basePath } = publicRuntimeConfig;

const cookieProps = (
  context: NextPageContext,
  noAuth?: boolean
): { theme: string; authenticated: boolean; hasToken: boolean } => {
  if (!context?.req)
    return { theme: 'dark', authenticated: false, hasToken: false };

  const cookies = parseCookies(context.req);

  const hasToken = !!cookies[appConstants.tokenCookieName];

  if (!cookies[appConstants.cookieName] && !noAuth) {
    context.res?.writeHead(302, { Location: logoutUrl || `${basePath}/login` });
    context.res?.end();

    return { theme: 'dark', authenticated: false, hasToken };
  }

  if (cookies?.theme) {
    return { theme: cookies.theme, authenticated: true, hasToken };
  }
  return { theme: 'dark', authenticated: true, hasToken };
};

type QueryProps = {
  document: DocumentNode;
  variables: {};
};

const isNotDocumentNode = (
  toBeDetermined: DocumentNode | QueryProps
): toBeDetermined is QueryProps => {
  if ((toBeDetermined as QueryProps).document) {
    return true;
  }
  return false;
};

export const getProps = async (
  context: NextPageContext,
  queries: (DocumentNode | QueryProps)[] = [],
  noAuth?: boolean
) => {
  const finalQueries = [...queries];

  if (context?.query?.token) {
    finalQueries.push({
      document: GET_AUTH_TOKEN,
      variables: { cookie: context.query.token },
    });
  }

  const { theme, authenticated, hasToken } = cookieProps(context, noAuth);

  const apolloClient = initializeApollo(undefined, context);

  if (finalQueries?.length && authenticated) {
    for (const query of finalQueries) {
      try {
        if (isNotDocumentNode(query)) {
          await apolloClient.query({
            query: query.document,
            variables: query.variables,
          });
        } else {
          await apolloClient.query({
            query,
          });
        }
      } catch (error: any) {
        // Ignore SSR query errors
      }
    }
  } else {
    return { props: { initialConfig: { theme }, hasToken, authenticated } };
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      initialConfig: { theme },
      hasToken,
      authenticated,
    },
  };
};
