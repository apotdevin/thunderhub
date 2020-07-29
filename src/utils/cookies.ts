import { IncomingMessage } from 'http';
import cookie from 'cookie';
import { NextPageContext } from 'next';

const parseCookies = (req: IncomingMessage) => {
  return cookie.parse(req ? req.headers.cookie || '' : document?.cookie);
};

type PropsReturnType = {
  props: {
    initialConfig: string;
  };
};

export const cookieProps = (context: NextPageContext): PropsReturnType => {
  if (!context?.req) return { props: { initialConfig: 'dark' } };
  const cookies = parseCookies(context.req);

  if (cookies?.theme) {
    return { props: { initialConfig: cookies.theme } };
  }
  return { props: { initialConfig: 'dark' } };
};
