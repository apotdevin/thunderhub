/**
 * Extract a useful message from a gRPC error (e.g. from tapd/lnd clients),
 * prefixed with a resolver-specific fallback so the client toast surfaces the
 * underlying cause (e.g. "Failed to mint asset: seedling decimal display does
 * not match group anchor: 6, 0") instead of just the generic fallback.
 */
export const grpcErrorMessage = (fallback: string, error: unknown): string => {
  if (error && typeof error === 'object') {
    const e = error as { details?: unknown; message?: unknown };
    if (typeof e.details === 'string' && e.details.length > 0) {
      return `${fallback}: ${e.details}`;
    }
    if (typeof e.message === 'string' && e.message.length > 0) {
      // Strip "Error: " and gRPC status prefix like "2 UNKNOWN: ".
      const cleaned = e.message
        .replace(/^Error:\s*/, '')
        .replace(/^\d+\s+[A-Z_]+:\s*/, '');
      return `${fallback}: ${cleaned}`;
    }
  }
  return fallback;
};
