import { bech32 } from 'bech32';

/**
 * Validates that a redirect URL is safe (relative path or same-origin).
 * Prevents open redirect attacks via server-provided logoutUrl.
 */
export const safeRedirect = (url: string, fallback: string): void => {
  // Allow relative paths
  if (url.startsWith('/')) {
    window.location.href = url;
    return;
  }

  try {
    const parsed = new URL(url);
    if (parsed.origin === window.location.origin) {
      window.location.href = url;
      return;
    }
  } catch {
    // Invalid URL, use fallback
  }

  window.location.href = fallback;
};

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
  const cleaned = url.trim().replace(/^lightning:/i, '');

  // If it's already a plain URL, return it directly
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  // Handle lnurlp://, lnurlw://, lnurlc:// protocol schemes
  const protocolMatch = cleaned.match(/^lnurl[pwc]:\/\/(.+)/i);
  if (protocolMatch) {
    return `https://${protocolMatch[1]}`;
  }

  // Otherwise, try bech32 decoding (LNURL1...)
  const { words } = bech32.decode(cleaned.toLowerCase(), 500);
  const bytes = bech32.fromWords(words);
  return new TextDecoder().decode(new Uint8Array(bytes));
};
