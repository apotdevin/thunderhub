import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import bip39 from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import secp256k1 from 'secp256k1';
import * as ecc from 'tiny-secp256k1';
import { enc } from 'crypto-js';
import { appUrls } from 'src/server/utils/appUrls';
import { FetchService } from '../../fetch/fetch.service';
import { bech32 } from 'bech32';

const bip32 = BIP32Factory(ecc);

const fromHexString = (hexString: string) =>
  new Uint8Array(
    hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const decodeLnUrl = (url: string): string => {
  const cleanUrl = url.toLowerCase().replace('lightning:', '');
  const { words } = bech32.decode(cleanUrl, 500);
  const bytes = bech32.fromWords(words);
  return new String(Buffer.from(bytes)).toString();
};

@Injectable()
export class LnMarketsService {
  constructor(
    private fetchService: FetchService,
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getUser(token: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.lnMarkets}/user`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(
        `Error getting user info from ${appUrls.lnMarkets}/user`,
        { error }
      );
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }
  }

  async getDepositInvoice(token: string, amount: number) {
    try {
      const response = await this.fetchService.fetchWithProxy(
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
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(`Error getting invoice to deposit from LnMarkets`, {
        error,
      });
      throw new Error('ProblemGettingDepositInvoice');
    }
  }

  async withdraw(token: string, amount: number, invoice: string) {
    try {
      const response = await this.fetchService.fetchWithProxy(
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
      return (await response.json()) as any;
    } catch (error: any) {
      this.logger.error(`Error withdrawing from LnMarkets`, { error });
      throw new Error('ProblemWithdrawingFromLnMarkets');
    }
  }

  async lnAuthUrlGenerator(url: string, id: string) {
    const domainUrl = new URL(url);
    const host = domainUrl.host;

    const k1 = domainUrl.searchParams.get('k1');

    if (!host || !k1) {
      this.logger.error('Missing host or k1 in url', { url });
      throw new Error('WrongUrlFormat');
    }

    const wallet = await this.nodeService.getWalletInfo(id);

    // Generate entropy
    const secret = await this.nodeService.diffieHellmanComputeSecret(id, {
      key_family: 138,
      key_index: 0,
      partner_public_key: wallet?.public_key,
    });

    // Generate hash from host and entropy
    const hashed = hmacSHA256(host, secret.secret).toString(enc.Hex);

    const indexes =
      hashed.match(/.{1,4}/g)?.map(index => parseInt(index, 16)) || [];

    // Generate private seed from entropy
    const secretKey = bip39.entropyToMnemonic(hashed);
    const base58 = bip39.mnemonicToSeedSync(secretKey);

    // Derive private seed from previous private seed and path
    const node: BIP32Interface = bip32.fromSeed(base58);
    const derived = node.derivePath(
      `m/138/${indexes[0]}/${indexes[1]}/${indexes[2]}/${indexes[3]}`
    );

    // Get private and public key from derived private seed
    const privateKey = derived.privateKey?.toString('hex');
    const linkingKey = derived.publicKey.toString('hex');

    if (!privateKey || !linkingKey) {
      this.logger.error('Error deriving private or public key', { url });
      throw new Error('ErrorDerivingPrivateKey');
    }

    // Sign k1 with derived private seed
    const sigObj = secp256k1.ecdsaSign(
      fromHexString(k1),
      fromHexString(privateKey)
    );

    // Get signature
    const signature = secp256k1.signatureExport(sigObj.signature);
    const encodedSignature = toHexString(signature);

    // Build and return final url with signature and public key
    return `${url}&sig=${encodedSignature}&key=${linkingKey}`;
  }

  async getLnMarketsAuth(
    id: string,
    cookie?: string | null
  ): Promise<{
    newCookie: boolean;
    cookieString?: string;
    json?: { status: string; reason: string; token: string };
  }> {
    if (cookie) {
      return { newCookie: false, cookieString: cookie };
    }

    if (!id) {
      this.logger.error(
        'Error getting authenticated LND instance in lnUrlAuth'
      );
      throw new Error('ProblemAuthenticatingWithLnUrlService');
    }

    let lnUrl = '';

    // Get a new lnUrl from LnMarkets
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${appUrls.lnMarkets}/lnurl/auth`,
        {
          method: 'post',
        }
      );
      const json = (await response.json()) as any;

      this.logger.debug('Get lnUrl from LnMarkets response', { json });
      lnUrl = json?.lnurl;
      if (!lnUrl) throw new Error();
    } catch (error: any) {
      this.logger.error(`Error getting lnAuth url from ${appUrls.lnMarkets}`, {
        error,
      });
      throw new Error('ProblemAuthenticatingWithLnMarkets');
    }

    // Decode the LnUrl and authenticate with it
    const decoded = decodeLnUrl(lnUrl);
    const finalUrl = await this.lnAuthUrlGenerator(decoded, id);

    // Try to authenticate with lnMarkets
    try {
      const response = await this.fetchService.fetchWithProxy(
        `${finalUrl}&jwt=true&expiry=3600`
      );
      const json = (await response.json()) as any;

      this.logger.debug('LnUrlAuth response', { json });

      if (!json?.token) {
        throw new Error('No token in response');
      }

      return { newCookie: true, cookieString: json.token, json };
    } catch (error: any) {
      this.logger.error('Error authenticating with LnUrl service', { error });
      throw new Error('ProblemAuthenticatingWithLnUrlService');
    }
  }
}
