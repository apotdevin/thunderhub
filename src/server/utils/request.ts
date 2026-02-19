import * as cookie from 'cookie';
import { appConstants } from './appConstants';

export const getAuthToken = (req: Request) => {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7, authHeader.length);
  }

  // Fall back to reading from the httpOnly cookie
  const cookies = cookie.parse(req.headers['cookie'] || '');
  return cookies[appConstants.cookieName] || '';
};
