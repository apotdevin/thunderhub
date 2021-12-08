import { decode, fromWords } from 'bech32';

export const getUrlParam = (
  params: string | string[] | undefined
): string | null => {
  if (!params) {
    return null;
  }
  const typeOfQuery = typeof params;
  if (typeOfQuery === 'string') {
    return params as string;
  }
  if (typeOfQuery === 'object') {
    return params[0];
  }

  return null;
};

export const decodeLnUrl = (url: string): string => {
  const cleanUrl = url.toLowerCase().replace('lightning:', '');
  const { words } = decode(cleanUrl, 500);
  const bytes = fromWords(words);
  return new String(Buffer.from(bytes)).toString();
};
