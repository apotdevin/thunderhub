import { logger } from 'server/helpers/logger';
import { appUrls } from 'server/utils/appUrls';
import { fetchWithProxy } from 'server/utils/fetch';

export const LnMarketsApi = {
  getUser: async (token: string) => {
    try {
      const response = await fetchWithProxy(`${appUrls.lnMarkets}/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error: any) {
      logger.error(
        `Error getting user info from ${appUrls.lnMarkets}/user. Error: %o`,
        error
      );
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }
  },
  getDepositInvoice: async (token: string, amount: number) => {
    try {
      const response = await fetchWithProxy(
        `${appUrls.lnMarkets}/user/deposit`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ amount, unit: 'sat' }),
        }
      );
      return await response.json();
    } catch (error: any) {
      logger.error(
        `Error getting invoice to deposit from LnMarkets. Error: %o`,
        error
      );
      throw new Error('ProblemGettingDepositInvoice');
    }
  },
  withdraw: async (token: string, amount: number, invoice: string) => {
    try {
      const response = await fetchWithProxy(
        `${appUrls.lnMarkets}/user/withdraw`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ amount, unit: 'sat', invoice }),
        }
      );
      return await response.json();
    } catch (error: any) {
      logger.error(`Error withdrawing from LnMarkets. Error: %o`, error);
      throw new Error('ProblemWithdrawingFromLnMarkets');
    }
  },
};
