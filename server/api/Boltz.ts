import { logger } from 'server/helpers/logger';
import { appUrls } from 'server/utils/appUrls';
import { fetchWithProxy } from 'server/utils/fetch';

export const BoltzApi = {
  getPairs: async () => {
    try {
      const response = await fetchWithProxy(`${appUrls.boltz}/getpairs`);
      return await response.json();
    } catch (error) {
      logger.error('Error getting pairs from Boltz: %o', error);
      throw new Error('ErrorGettingBoltzPairs');
    }
  },
  getFeeEstimations: async () => {
    try {
      const response = await fetchWithProxy(
        `${appUrls.boltz}/getfeeestimation`
      );
      return await response.json();
    } catch (error) {
      logger.error('Error getting fee estimations from Boltz: %o', error);
      throw new Error(error);
    }
  },
  getSwapStatus: async (id: string) => {
    try {
      const body = { id };
      const response = await fetchWithProxy(`${appUrls.boltz}/swapstatus`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      logger.error('Error getting fee estimations from Boltz: %o', error);
      throw new Error(error);
    }
  },
  createReverseSwap: async (
    invoiceAmount: number,
    preimageHash: string,
    claimPublicKey: string
  ) => {
    try {
      const body = {
        type: 'reversesubmarine',
        pairId: 'BTC/BTC',
        orderSide: 'buy',
        invoiceAmount,
        preimageHash,
        claimPublicKey,
      };
      const response = await fetchWithProxy(`${appUrls.boltz}/createswap`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      logger.error('Error getting fee estimations from Boltz: %o', error);
      throw new Error(error);
    }
  },
  broadcastTransaction: async (transactionHex: string) => {
    try {
      const body = {
        currency: 'BTC',
        transactionHex,
      };
      const response = await fetchWithProxy(
        `${appUrls.boltz}/broadcasttransaction`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return await response.json();
    } catch (error) {
      logger.error('Error broadcasting transaction from Boltz: %o', error);
      throw new Error(error);
    }
  },
};
