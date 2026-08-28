// Pure path helpers. Keep this file dependency-free: it is imported by
// vite.config.ts (node context) as well as client code.

/** Removes all trailing slashes: '/thub/' -> '/thub', '/' -> '' */
export const stripTrailingSlashes = (path: string): string =>
  path.replace(/\/+$/, '');

/** Ensures exactly one trailing slash: '/thub' -> '/thub/', '' -> '/' */
export const withTrailingSlash = (path: string): string =>
  `${stripTrailingSlashes(path)}/`;
