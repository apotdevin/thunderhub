import cookie from 'cookie';

export const parseCookies = req => {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
};
