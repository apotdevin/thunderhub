import { config } from '../config/thunderhubConfig';

const { basePath } = config;

export const appendBasePath = (url: string): string => `${basePath}${url}`;
