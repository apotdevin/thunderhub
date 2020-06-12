import { clientEnv } from 'server/utils/appEnv';

const { basePath } = clientEnv;

export const appendBasePath = (url: string): string => `${basePath}${url}`;
