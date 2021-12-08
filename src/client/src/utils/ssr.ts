import { NextPageContext } from 'next';
import { parseCookies } from '../utils/cookies';
import { appConstants } from './appConstants';

const cookieProps = (
  context: NextPageContext,
  noAuth?: boolean
): {
  theme: string;
  authenticated: boolean;
  hasToken: boolean;
  authToken: string;
} => {
  if (!context?.req)
    return {
      theme: 'dark',
      authenticated: false,
      hasToken: false,
      authToken: '',
    };

  const cookies = parseCookies(context.req);

  const hasToken = !!cookies[appConstants.tokenCookieName];

  if (!cookies[appConstants.cookieName] && !noAuth) {
    return { theme: 'dark', authenticated: false, hasToken, authToken: '' };
  }

  return {
    theme: cookies?.theme ? cookies.theme : 'dark',
    authenticated: true,
    hasToken,
    authToken: cookies[appConstants.cookieName] || '',
  };
};

export const getProps = async (context: NextPageContext, noAuth?: boolean) => {
  const { theme, authenticated, hasToken, authToken } = cookieProps(
    context,
    noAuth
  );

  return {
    props: { initialConfig: { theme }, hasToken, authenticated, authToken },
  };
};
