// import { publicRuntimeConfig } from '../../next.config';
// import { publicRuntimeConfig } from '../../next.config';
import getConfig from 'next/config';
import { GatewayInfo, Federation } from './types';

// const SESSION_STORAGE_KEY = 'gateway-ui-key';

const { publicRuntimeConfig } = getConfig();

// GatewayApi is an implementation of the ApiInterface
<<<<<<< HEAD
class GatewayApi {
  private baseUrl: string | undefined = publicRuntimeConfig.fmGatewayUrl;
  private password: string | undefined = publicRuntimeConfig.fmGatewayPassword;
||||||| parent of 9e521814 (feat: connect to federation card)
export class GatewayApi {
  private baseUrl: string | undefined = process.env.REACT_APP_FM_GATEWAY_API;

  // Tests a provided password, or the one in the environment config, or the one in session storage
  testPassword = async (password?: string): Promise<boolean> => {
    const tempPassword =
      password ||
      this.getPassword() ||
      process.env.REACT_APP_FM_GATEWAY_PASSWORD;

    if (!tempPassword) {
      return false;
    }

    // Replace with temp password to check.
    sessionStorage.setItem(SESSION_STORAGE_KEY, tempPassword);

    try {
      await this.fetchInfo();
      return true;
    } catch (err) {
      // TODO: make sure error is auth error, not unrelated
      console.error(err);
      this.clearPassword();
      return false;
    }
  };

  private getPassword = (): string | null => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  };

  clearPassword = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };
=======
export class GatewayApi {
  private baseUrl: string | undefined = process.env.FM_GATEWAY_API;

  // Tests a provided password, or the one in the environment config, or the one in session storage
  testPassword = async (password?: string): Promise<boolean> => {
    const tempPassword =
      password || this.getPassword() || process.env.FM_GATEWAY_PASSWORD;

    if (!tempPassword) {
      return false;
    }

    // Replace with temp password to check.
    sessionStorage.setItem(SESSION_STORAGE_KEY, tempPassword);

    try {
      await this.fetchInfo();
      return true;
    } catch (err) {
      // TODO: make sure error is auth error, not unrelated
      console.error(err);
      this.clearPassword();
      return false;
    }
  };

  private getPassword = (): string | null => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  };

  clearPassword = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };
>>>>>>> 9e521814 (feat: connect to federation card)

  private post = async (api: string, body: unknown): Promise<Response> => {
    if (this.baseUrl === undefined) {
      throw new Error(
        'Misconfigured Gateway API. Make sure FM_GATEWAY_API is configured appropriately'
      );
    }

    if (this.password === undefined) {
      throw new Error(
        'Misconfigured Gateway API. Make sure gateway password is configured appropriately'
      );
    }

    return fetch(`${this.baseUrl}/${api}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.password}`,
      },
      body: JSON.stringify(body),
    });
  };

  fetchInfo = async (): Promise<GatewayInfo> => {
    try {
      const res: Response = await this.post('info', null);

      if (res.ok) {
        const info: GatewayInfo = await res.json();
        return Promise.resolve(info);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error fetching gateway info', error });
    }
  };

  fetchAddress = async (federationId: string): Promise<string> => {
    try {
      const res: Response = await this.post('address', {
        federation_id: federationId,
      });

      if (res.ok) {
        const address: string = (await res.text()).replace(/"/g, '').trim();
        return Promise.resolve(address);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({
        message: 'Error fetching deposit address',
        error,
      });
    }
  };

  connectFederation = async (inviteCode: string): Promise<Federation> => {
    try {
      const res: Response = await this.post('connect-fed', {
        invite_code: inviteCode,
      });

      if (res.ok) {
        const federation: Federation = await res.json();
        return Promise.resolve(federation);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error connecting federation', error });
    }
  };

  requestWithdrawal = async (
    federationId: string,
    amountSat: number | 'all',
    address: string
  ): Promise<string> => {
    try {
      const res: Response = await this.post('withdraw', {
        federation_id: federationId,
        amount: amountSat,
        address,
      });

      if (res.ok) {
        const txid: string = await res.text();
        return Promise.resolve(txid);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error requesting withdrawal', error });
    }
  };
}

const responseToError = (res: Response): Error => {
  return new Error(`Status : ${res.status} \nReason : ${res.statusText}\n`);
};

export const gatewayApi = new GatewayApi();
