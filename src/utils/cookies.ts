import { IncomingMessage } from 'http';
import cookie from 'cookie';

export const parseCookies = (req: IncomingMessage) => {
  return cookie.parse(req ? req.headers.cookie || '' : document?.cookie);
};
