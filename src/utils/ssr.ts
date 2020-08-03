import { NextPageContext } from 'next';
import { initializeApollo } from 'config/client';
import { parseCookies } from 'src/utils/cookies';
import { DocumentNode } from 'graphql';

const themeProp = (context: NextPageContext): string => {
  if (!context?.req) return 'dark';
  const cookies = parseCookies(context.req);

  if (cookies?.theme) {
    return cookies.theme;
  }
  return 'dark';
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
  queries?: (DocumentNode | QueryProps)[]
) => {
  const theme = themeProp(context);
  const apolloClient = initializeApollo(undefined, context.req, context.res);

  if (queries?.length) {
    for (const query of queries) {
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
    }
  } else {
    return {
      props: {
        initialConfig: theme,
      },
    };
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      initialConfig: theme,
    },
  };
};
