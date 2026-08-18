/**
 * Boltz took their swap service offline until further notice, so new swaps
 * cannot be created. Claiming and refunding existing swaps still works, both
 * cooperatively through the Boltz API and unilaterally without it.
 *
 * Official status: https://boltz.exchange/
 */
export const BOLTZ_SWAPS_DISABLED: boolean = true;

export const BOLTZ_STATUS_URL = 'https://boltz.exchange/';
