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

export const getProps = async (
  context: NextPageContext,
  queries?: DocumentNode[]
) => {
  const theme = themeProp(context);
  const apolloClient = initializeApollo(undefined, context.req, context.res);

  if (queries?.length) {
    for (const query of queries) {
      await apolloClient.query({
        query,
      });
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
