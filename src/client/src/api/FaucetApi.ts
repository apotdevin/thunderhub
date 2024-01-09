// GatewayApi is an implementation of the ApiInterface
class FaucetApi {
  private baseUrl: string | undefined = 'https://faucet.mutinynet.com/api';

  private post = async (api: string, body: unknown): Promise<Response> => {
    return fetch(`${this.baseUrl}/${api}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  onchain = async (body: { address: string; sats: number }) => {
    try {
      if (body.sats < 10000 || body.sats > 200000)
        throw new Error('Amount must be between 10000 and 200000');

      const res = await this.post('onchain', body);

      if (res.ok) {
        const result = await res.json();
        return Promise.resolve(result);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({
        message: (error as Error).message,
        error,
      });
    }
  };

  payInvoice = async (body: { bolt11: string }) => {
    try {
      const res = await this.post('lightning', body);

      if (res.ok) {
        const result = await res.json();
        return Promise.resolve(result);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: (error as Error).message, error });
    }
  };

  refundFaucet = async (body: { amount_sats: number }) => {
    try {
      const res = await this.post('bolt11', body);

      if (res.ok) {
        const result = await res.text();
        return Promise.resolve(result);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: (error as Error).message, error });
    }
  };

  requestChannel = async (body: {
    capacity: number;
    push_amount: number;
    pubkey: string;
    host: string;
  }) => {
    try {
      const res = await this.post('channel', body);

      if (res.ok) {
        const result = await res.json();
        return Promise.resolve(result);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: (error as Error).message, error });
    }
  };
}

const responseToError = (res: Response): Error => {
  return new Error(`Status : ${res.status} \nReason : ${res.statusText}\n`);
};

export const faucetApi = new FaucetApi();
