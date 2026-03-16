export const BOLTZ_STATUS = {
  SWAP_CREATED: 'swap.created',
  INVOICE_SET: 'invoice.set',
  INVOICE_PENDING: 'invoice.pending',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_SETTLED: 'invoice.settled',
  INVOICE_EXPIRED: 'invoice.expired',
  INVOICE_FAILED: 'invoice.failedToPay',
  TX_MEMPOOL: 'transaction.mempool',
  TX_CONFIRMED: 'transaction.confirmed',
  TX_CLAIMED: 'transaction.claimed',
  TX_REFUNDED: 'transaction.refunded',
  SWAP_EXPIRED: 'swap.expired',
} as const;

const statusLabels: Record<string, string> = {
  [BOLTZ_STATUS.SWAP_CREATED]: 'Swap created',
  [BOLTZ_STATUS.INVOICE_SET]: 'Invoice set',
  [BOLTZ_STATUS.INVOICE_PENDING]: 'Invoice pending...',
  [BOLTZ_STATUS.INVOICE_PAID]: 'Invoice paid',
  [BOLTZ_STATUS.INVOICE_SETTLED]: 'Invoice settled',
  [BOLTZ_STATUS.TX_MEMPOOL]: 'Transaction in mempool',
  [BOLTZ_STATUS.TX_CONFIRMED]: 'Transaction confirmed',
  [BOLTZ_STATUS.TX_CLAIMED]: 'Transaction claimed',
  [BOLTZ_STATUS.TX_REFUNDED]: 'Transaction refunded',
  [BOLTZ_STATUS.SWAP_EXPIRED]: 'Swap expired',
  [BOLTZ_STATUS.INVOICE_EXPIRED]: 'Swap expired',
  [BOLTZ_STATUS.INVOICE_FAILED]: 'Failed to pay',
};

export const boltzStatusLabel = (status: string | null): string | null => {
  if (!status) return null;
  return statusLabels[status] ?? null;
};

const failedStatuses: Set<string> = new Set([
  BOLTZ_STATUS.SWAP_EXPIRED,
  BOLTZ_STATUS.INVOICE_EXPIRED,
  BOLTZ_STATUS.INVOICE_FAILED,
]);

export const isFailedStatus = (status: string | null) =>
  !!status && failedStatuses.has(status);

const claimableStatuses: Set<string> = new Set([
  BOLTZ_STATUS.TX_MEMPOOL,
  BOLTZ_STATUS.TX_CONFIRMED,
]);

export const isClaimableStatus = (status: string | null) =>
  !!status && claimableStatuses.has(status);
