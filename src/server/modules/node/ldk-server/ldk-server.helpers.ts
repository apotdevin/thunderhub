import crypto from 'crypto';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { error as errorProto } from './proto/ldk-server';

export class LdkServerClient {
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly httpsAgent?: https.Agent;

  constructor(baseUrl: string, apiKey: string, tlsCertPath?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;

    if (baseUrl.startsWith('https')) {
      if (tlsCertPath) {
        const ca = fs.readFileSync(tlsCertPath);
        this.httpsAgent = new https.Agent({ ca });
      } else {
        // No cert provided — skip verification for self-signed certs
        this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      }
    }
  }

  private computeHmac(timestamp: bigint, body: Uint8Array): string {
    const hmac = crypto.createHmac('sha256', this.apiKey);
    const tsBytes = Buffer.alloc(8);
    tsBytes.writeBigUInt64BE(timestamp);
    hmac.update(tsBytes);
    hmac.update(body);
    return hmac.digest('hex');
  }

  async request<Res>(
    endpoint: string,
    RequestClass: { encode(message: any, writer?: any): any },
    ResponseClass: { decode(reader: Uint8Array, length?: number): Res },
    data: Record<string, any>
  ): Promise<Res> {
    const writer = RequestClass.encode(data);
    const body = writer.finish() as Uint8Array;

    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const hmacHex = this.computeHmac(timestamp, body);

    const url = `${this.baseUrl}/${endpoint}`;
    const bodyBuf = Buffer.from(body);

    const resp = await this.doRequest(url, bodyBuf, timestamp, hmacHex);

    if (resp.statusCode < 200 || resp.statusCode >= 300) {
      let errorMsg = `ldk-server error (${resp.statusCode})`;
      try {
        const errorResponse = errorProto.ErrorResponse.decode(
          new Uint8Array(resp.data)
        );
        errorMsg = errorResponse.message || errorMsg;
      } catch {
        // Could not decode error response
      }
      throw new Error(errorMsg);
    }

    return ResponseClass.decode(new Uint8Array(resp.data));
  }

  private doRequest(
    url: string,
    body: Buffer,
    timestamp: bigint,
    hmacHex: string
  ): Promise<{ statusCode: number; data: Buffer }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';
      const mod = isHttps ? https : http;

      const options: https.RequestOptions = {
        method: 'POST',
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Auth': `HMAC ${timestamp.toString()}:${hmacHex}`,
          'Content-Length': body.length,
        },
        ...(isHttps && this.httpsAgent ? { agent: this.httpsAgent } : {}),
      };

      const req = mod.request(options, res => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            data: Buffer.concat(chunks),
          });
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

export function createLdkServerClient(config: {
  socket: string;
  authToken?: string;
  tlsCertPath?: string;
}): LdkServerClient {
  if (!config.authToken) {
    throw new Error(
      'ldk-server requires an authToken (API key) in the account configuration'
    );
  }
  return new LdkServerClient(
    config.socket,
    config.authToken,
    config.tlsCertPath
  );
}

/** Convert Long/number protobuf values to number */
export function toNumber(val: any): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  // protobufjs Long
  if (typeof val.toNumber === 'function') return val.toNumber();
  return Number(val);
}

/** Convert msat to sat (tokens) */
export function msatToSat(msat: any): number {
  return Math.floor(toNumber(msat) / 1000);
}

/**
 * Endpoint path constants matching ldk-server's routing.
 * Must match ldk-server-protos/src/endpoints.rs exactly.
 */
export const Endpoints = {
  GET_NODE_INFO: 'GetNodeInfo',
  GET_BALANCES: 'GetBalances',
  ONCHAIN_RECEIVE: 'OnchainReceive',
  ONCHAIN_SEND: 'OnchainSend',
  BOLT11_RECEIVE: 'Bolt11Receive',
  BOLT11_SEND: 'Bolt11Send',
  BOLT12_RECEIVE: 'Bolt12Receive',
  BOLT12_SEND: 'Bolt12Send',
  OPEN_CHANNEL: 'OpenChannel',
  SPLICE_IN: 'SpliceIn',
  SPLICE_OUT: 'SpliceOut',
  CLOSE_CHANNEL: 'CloseChannel',
  FORCE_CLOSE_CHANNEL: 'ForceCloseChannel',
  LIST_CHANNELS: 'ListChannels',
  UPDATE_CHANNEL_CONFIG: 'UpdateChannelConfig',
  GET_PAYMENT_DETAILS: 'GetPaymentDetails',
  LIST_PAYMENTS: 'ListPayments',
  LIST_FORWARDED_PAYMENTS: 'ListForwardedPayments',
  LIST_PEERS: 'ListPeers',
  CONNECT_PEER: 'ConnectPeer',
  DISCONNECT_PEER: 'DisconnectPeer',
  SPONTANEOUS_SEND: 'SpontaneousSend',
  SIGN_MESSAGE: 'SignMessage',
  VERIFY_SIGNATURE: 'VerifySignature',
  GRAPH_LIST_CHANNELS: 'GraphListChannels',
  GRAPH_GET_CHANNEL: 'GraphGetChannel',
  GRAPH_LIST_NODES: 'GraphListNodes',
  GRAPH_GET_NODE: 'GraphGetNode',
  DECODE_INVOICE: 'DecodeInvoice',
} as const;
