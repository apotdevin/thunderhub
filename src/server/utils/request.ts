import { Ipware } from '@fullerstack/nax-ipware';
import cookie from 'cookie';
import { appConstants } from './appConstants';

const ipware = new Ipware();

export const getIp = (req: any) => {
  const ip_info = ipware.getClientIP(req);
  return ip_info.ip;
};

export const getAuthToken = (req: Request) => {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7, authHeader.length);
  }

  // Fall back to reading from the httpOnly cookie
  const cookies = cookie.parse(req.headers['cookie'] || '');
  return cookies[appConstants.cookieName] || '';
};
