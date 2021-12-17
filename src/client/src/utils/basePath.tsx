import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { basePath } = publicRuntimeConfig;

export const appendBasePath = (url: string): string => `${basePath}${url}`;
