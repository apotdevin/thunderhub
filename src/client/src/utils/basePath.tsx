import { config } from '../config/thunderhubConfig';

export const appendBasePath = (url: string): string =>
  `${config.basePath}${url}`;
