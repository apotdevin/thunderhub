import crypto from 'crypto';
import EventEmitter from 'events';
import fs from 'fs';
import http2 from 'http2';

const GRPC_SERVICE_PREFIX = '/api.LightningNode/';

export class LdkServerClient {
  readonly authority: string;
  readonly scheme: 'http' | 'https';
  readonly apiKey: string;
  readonly ca?: Buffer;

  constructor(
    baseUrl: string,
    apiKey: string,
    tlsCertPath?: string,
    cert?: string
  ) {
    const normalized = normalizeGrpcAddress(baseUrl);
    this.authority = normalized.authority;
    this.scheme = normalized.scheme;
    this.apiKey = apiKey;

    this.ca = tlsCertPath
      ? fs.readFileSync(tlsCertPath)
      : cert
        ? Buffer.from(cert)
        : undefined;
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
    const body = encodeGrpcFrame(RequestClass.encode(data).finish());

    const resp = await this.doRequest(endpoint, body);
    const messages = decodeGrpcFrames(resp.data);
    const payload = messages[0] || new Uint8Array();
    return ResponseClass.decode(payload);
  }

  subscribe<Res>(
    endpoint: string,
    RequestClass: { encode(message: any, writer?: any): any },
    ResponseClass: { decode(reader: Uint8Array, length?: number): Res },
    data: Record<string, any>
  ): EventEmitter & { stop: () => void } {
    const emitter = new EventEmitter() as EventEmitter & { stop: () => void };
    const body = encodeGrpcFrame(RequestClass.encode(data).finish());
    const session = this.createSession();
    const req = session.request(this.grpcHeaders(endpoint, body));
    const chunks: Buffer[] = [];

    emitter.stop = () => {
      req.close();
      session.close();
    };

    req.on('response', headers => {
      const error = grpcErrorFromHeaders(headers);
      if (error) emitter.emit('error', error);
    });

    req.on('trailers', headers => {
      const error = grpcErrorFromHeaders(headers);
      if (error) emitter.emit('error', error);
    });

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      const parsed = takeGrpcFrames(Buffer.concat(chunks));
      chunks.splice(0, chunks.length, parsed.remaining);
      parsed.messages.forEach(message => {
        try {
          emitter.emit('data', ResponseClass.decode(message));
        } catch (error) {
          emitter.emit('error', error);
        }
      });
    });

    req.on('error', error => emitter.emit('error', error));
    session.on('error', error => emitter.emit('error', error));
    req.on('end', () => {
      session.close();
      emitter.emit('end');
    });

    req.end(body);
    return emitter;
  }

  private doRequest(endpoint: string, body: Buffer): Promise<{ data: Buffer }> {
    return new Promise((resolve, reject) => {
      const session = this.createSession();
      const req = session.request(this.grpcHeaders(endpoint, body));
      const chunks: Buffer[] = [];
      let grpcError: Error | undefined;

      req.on('response', headers => {
        grpcError = grpcErrorFromHeaders(headers) || grpcError;
      });

      req.on('trailers', headers => {
        grpcError = grpcErrorFromHeaders(headers) || grpcError;
      });

      req.on('error', reject);
      session.on('error', reject);
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        session.close();
        const data = Buffer.concat(chunks);
        if (grpcError) {
          reject(grpcError);
          return;
        }
        resolve({ data });
      });
      req.end(body);
    });
  }

  private createSession(): http2.ClientHttp2Session {
    return http2.connect(`${this.scheme}://${this.authority}`, {
      ca: this.ca,
      rejectUnauthorized: this.scheme === 'https' ? Boolean(this.ca) : false,
    });
  }

  private grpcHeaders(
    endpoint: string,
    body: Buffer
  ): http2.OutgoingHttpHeaders {
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const hmacHex = this.computeHmac(timestamp, body);

    return {
      [http2.constants.HTTP2_HEADER_METHOD]: 'POST',
      [http2.constants.HTTP2_HEADER_PATH]: `${GRPC_SERVICE_PREFIX}${endpoint}`,
      [http2.constants.HTTP2_HEADER_SCHEME]: this.scheme,
      [http2.constants.HTTP2_HEADER_AUTHORITY]: this.authority,
      [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto',
      te: 'trailers',
      'x-auth': `HMAC ${timestamp.toString()}:${hmacHex}`,
    };
  }
}

export function createLdkServerClient(config: {
  socket: string;
  cert?: string;
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
    config.tlsCertPath,
    config.cert
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
  SUBSCRIBE_EVENTS: 'SubscribeEvents',
} as const;

function normalizeGrpcAddress(baseUrl: string): {
  scheme: 'http' | 'https';
  authority: string;
} {
  const withScheme = /^[a-z]+:\/\//i.test(baseUrl)
    ? baseUrl
    : `https://${baseUrl}`;
  const url = new URL(withScheme);
  return {
    scheme: url.protocol === 'http:' ? 'http' : 'https',
    authority: url.host,
  };
}

function encodeGrpcFrame(payload: Uint8Array): Buffer {
  const frame = Buffer.alloc(5 + payload.length);
  frame.writeUInt8(0, 0);
  frame.writeUInt32BE(payload.length, 1);
  Buffer.from(payload).copy(frame, 5);
  return frame;
}

function decodeGrpcFrames(data: Buffer): Uint8Array[] {
  return takeGrpcFrames(data).messages;
}

function takeGrpcFrames(data: Buffer): {
  messages: Uint8Array[];
  remaining: Buffer;
} {
  const messages: Uint8Array[] = [];
  let offset = 0;

  while (data.length - offset >= 5) {
    const compressed = data.readUInt8(offset);
    const length = data.readUInt32BE(offset + 1);

    if (data.length - offset - 5 < length) break;
    if (compressed) {
      throw new Error('ldk-server returned compressed gRPC frames');
    }

    messages.push(data.subarray(offset + 5, offset + 5 + length));
    offset += 5 + length;
  }

  return { messages, remaining: data.subarray(offset) };
}

function grpcErrorFromHeaders(
  headers: http2.IncomingHttpHeaders
): Error | undefined {
  const status = headerValue(headers['grpc-status']);
  if (!status || status === '0') return undefined;

  const message = decodeURIComponent(
    headerValue(headers['grpc-message']) || `gRPC status ${status}`
  );
  return new Error(`ldk-server error (${status}): ${message}`);
}

function headerValue(value: string | string[] | number | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value == null ? '' : String(value);
}
