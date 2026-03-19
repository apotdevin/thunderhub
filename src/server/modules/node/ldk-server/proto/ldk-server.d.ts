import * as $protobuf from 'protobufjs';
import Long = require('long');
/** Namespace api. */
export namespace api {
  /** Properties of a GetNodeInfoRequest. */
  interface IGetNodeInfoRequest {}

  /** Represents a GetNodeInfoRequest. */
  class GetNodeInfoRequest implements IGetNodeInfoRequest {
    /**
     * Constructs a new GetNodeInfoRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetNodeInfoRequest);

    /**
     * Creates a new GetNodeInfoRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetNodeInfoRequest instance
     */
    public static create(
      properties?: api.IGetNodeInfoRequest
    ): api.GetNodeInfoRequest;

    /**
     * Encodes the specified GetNodeInfoRequest message. Does not implicitly {@link api.GetNodeInfoRequest.verify|verify} messages.
     * @param message GetNodeInfoRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetNodeInfoRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetNodeInfoRequest message, length delimited. Does not implicitly {@link api.GetNodeInfoRequest.verify|verify} messages.
     * @param message GetNodeInfoRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetNodeInfoRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetNodeInfoRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetNodeInfoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetNodeInfoRequest;

    /**
     * Decodes a GetNodeInfoRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetNodeInfoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetNodeInfoRequest;

    /**
     * Verifies a GetNodeInfoRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetNodeInfoRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetNodeInfoRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetNodeInfoRequest;

    /**
     * Creates a plain object from a GetNodeInfoRequest message. Also converts values to other types if specified.
     * @param message GetNodeInfoRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetNodeInfoRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetNodeInfoRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetNodeInfoRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GetNodeInfoResponse. */
  interface IGetNodeInfoResponse {
    /** GetNodeInfoResponse nodeId */
    nodeId?: string | null;

    /** GetNodeInfoResponse currentBestBlock */
    currentBestBlock?: types.IBestBlock | null;

    /** GetNodeInfoResponse latestLightningWalletSyncTimestamp */
    latestLightningWalletSyncTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestOnchainWalletSyncTimestamp */
    latestOnchainWalletSyncTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestFeeRateCacheUpdateTimestamp */
    latestFeeRateCacheUpdateTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestRgsSnapshotTimestamp */
    latestRgsSnapshotTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestNodeAnnouncementBroadcastTimestamp */
    latestNodeAnnouncementBroadcastTimestamp?: number | Long | null;

    /** GetNodeInfoResponse listeningAddresses */
    listeningAddresses?: string[] | null;

    /** GetNodeInfoResponse announcementAddresses */
    announcementAddresses?: string[] | null;

    /** GetNodeInfoResponse nodeAlias */
    nodeAlias?: string | null;

    /** GetNodeInfoResponse nodeUris */
    nodeUris?: string[] | null;
  }

  /** Represents a GetNodeInfoResponse. */
  class GetNodeInfoResponse implements IGetNodeInfoResponse {
    /**
     * Constructs a new GetNodeInfoResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetNodeInfoResponse);

    /** GetNodeInfoResponse nodeId. */
    public nodeId: string;

    /** GetNodeInfoResponse currentBestBlock. */
    public currentBestBlock?: types.IBestBlock | null;

    /** GetNodeInfoResponse latestLightningWalletSyncTimestamp. */
    public latestLightningWalletSyncTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestOnchainWalletSyncTimestamp. */
    public latestOnchainWalletSyncTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestFeeRateCacheUpdateTimestamp. */
    public latestFeeRateCacheUpdateTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestRgsSnapshotTimestamp. */
    public latestRgsSnapshotTimestamp?: number | Long | null;

    /** GetNodeInfoResponse latestNodeAnnouncementBroadcastTimestamp. */
    public latestNodeAnnouncementBroadcastTimestamp?: number | Long | null;

    /** GetNodeInfoResponse listeningAddresses. */
    public listeningAddresses: string[];

    /** GetNodeInfoResponse announcementAddresses. */
    public announcementAddresses: string[];

    /** GetNodeInfoResponse nodeAlias. */
    public nodeAlias?: string | null;

    /** GetNodeInfoResponse nodeUris. */
    public nodeUris: string[];

    /**
     * Creates a new GetNodeInfoResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetNodeInfoResponse instance
     */
    public static create(
      properties?: api.IGetNodeInfoResponse
    ): api.GetNodeInfoResponse;

    /**
     * Encodes the specified GetNodeInfoResponse message. Does not implicitly {@link api.GetNodeInfoResponse.verify|verify} messages.
     * @param message GetNodeInfoResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetNodeInfoResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetNodeInfoResponse message, length delimited. Does not implicitly {@link api.GetNodeInfoResponse.verify|verify} messages.
     * @param message GetNodeInfoResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetNodeInfoResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetNodeInfoResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetNodeInfoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetNodeInfoResponse;

    /**
     * Decodes a GetNodeInfoResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetNodeInfoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetNodeInfoResponse;

    /**
     * Verifies a GetNodeInfoResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetNodeInfoResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetNodeInfoResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetNodeInfoResponse;

    /**
     * Creates a plain object from a GetNodeInfoResponse message. Also converts values to other types if specified.
     * @param message GetNodeInfoResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetNodeInfoResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetNodeInfoResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetNodeInfoResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OnchainReceiveRequest. */
  interface IOnchainReceiveRequest {}

  /** Represents an OnchainReceiveRequest. */
  class OnchainReceiveRequest implements IOnchainReceiveRequest {
    /**
     * Constructs a new OnchainReceiveRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOnchainReceiveRequest);

    /**
     * Creates a new OnchainReceiveRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OnchainReceiveRequest instance
     */
    public static create(
      properties?: api.IOnchainReceiveRequest
    ): api.OnchainReceiveRequest;

    /**
     * Encodes the specified OnchainReceiveRequest message. Does not implicitly {@link api.OnchainReceiveRequest.verify|verify} messages.
     * @param message OnchainReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOnchainReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OnchainReceiveRequest message, length delimited. Does not implicitly {@link api.OnchainReceiveRequest.verify|verify} messages.
     * @param message OnchainReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOnchainReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OnchainReceiveRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OnchainReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OnchainReceiveRequest;

    /**
     * Decodes an OnchainReceiveRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OnchainReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OnchainReceiveRequest;

    /**
     * Verifies an OnchainReceiveRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OnchainReceiveRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OnchainReceiveRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OnchainReceiveRequest;

    /**
     * Creates a plain object from an OnchainReceiveRequest message. Also converts values to other types if specified.
     * @param message OnchainReceiveRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OnchainReceiveRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OnchainReceiveRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OnchainReceiveRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OnchainReceiveResponse. */
  interface IOnchainReceiveResponse {
    /** OnchainReceiveResponse address */
    address?: string | null;
  }

  /** Represents an OnchainReceiveResponse. */
  class OnchainReceiveResponse implements IOnchainReceiveResponse {
    /**
     * Constructs a new OnchainReceiveResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOnchainReceiveResponse);

    /** OnchainReceiveResponse address. */
    public address: string;

    /**
     * Creates a new OnchainReceiveResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OnchainReceiveResponse instance
     */
    public static create(
      properties?: api.IOnchainReceiveResponse
    ): api.OnchainReceiveResponse;

    /**
     * Encodes the specified OnchainReceiveResponse message. Does not implicitly {@link api.OnchainReceiveResponse.verify|verify} messages.
     * @param message OnchainReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOnchainReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OnchainReceiveResponse message, length delimited. Does not implicitly {@link api.OnchainReceiveResponse.verify|verify} messages.
     * @param message OnchainReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOnchainReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OnchainReceiveResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OnchainReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OnchainReceiveResponse;

    /**
     * Decodes an OnchainReceiveResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OnchainReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OnchainReceiveResponse;

    /**
     * Verifies an OnchainReceiveResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OnchainReceiveResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OnchainReceiveResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OnchainReceiveResponse;

    /**
     * Creates a plain object from an OnchainReceiveResponse message. Also converts values to other types if specified.
     * @param message OnchainReceiveResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OnchainReceiveResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OnchainReceiveResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OnchainReceiveResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OnchainSendRequest. */
  interface IOnchainSendRequest {
    /** OnchainSendRequest address */
    address?: string | null;

    /** OnchainSendRequest amountSats */
    amountSats?: number | Long | null;

    /** OnchainSendRequest sendAll */
    sendAll?: boolean | null;

    /** OnchainSendRequest feeRateSatPerVb */
    feeRateSatPerVb?: number | Long | null;
  }

  /** Represents an OnchainSendRequest. */
  class OnchainSendRequest implements IOnchainSendRequest {
    /**
     * Constructs a new OnchainSendRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOnchainSendRequest);

    /** OnchainSendRequest address. */
    public address: string;

    /** OnchainSendRequest amountSats. */
    public amountSats?: number | Long | null;

    /** OnchainSendRequest sendAll. */
    public sendAll?: boolean | null;

    /** OnchainSendRequest feeRateSatPerVb. */
    public feeRateSatPerVb?: number | Long | null;

    /**
     * Creates a new OnchainSendRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OnchainSendRequest instance
     */
    public static create(
      properties?: api.IOnchainSendRequest
    ): api.OnchainSendRequest;

    /**
     * Encodes the specified OnchainSendRequest message. Does not implicitly {@link api.OnchainSendRequest.verify|verify} messages.
     * @param message OnchainSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOnchainSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OnchainSendRequest message, length delimited. Does not implicitly {@link api.OnchainSendRequest.verify|verify} messages.
     * @param message OnchainSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOnchainSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OnchainSendRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OnchainSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OnchainSendRequest;

    /**
     * Decodes an OnchainSendRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OnchainSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OnchainSendRequest;

    /**
     * Verifies an OnchainSendRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OnchainSendRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OnchainSendRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OnchainSendRequest;

    /**
     * Creates a plain object from an OnchainSendRequest message. Also converts values to other types if specified.
     * @param message OnchainSendRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OnchainSendRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OnchainSendRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OnchainSendRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OnchainSendResponse. */
  interface IOnchainSendResponse {
    /** OnchainSendResponse txid */
    txid?: string | null;
  }

  /** Represents an OnchainSendResponse. */
  class OnchainSendResponse implements IOnchainSendResponse {
    /**
     * Constructs a new OnchainSendResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOnchainSendResponse);

    /** OnchainSendResponse txid. */
    public txid: string;

    /**
     * Creates a new OnchainSendResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OnchainSendResponse instance
     */
    public static create(
      properties?: api.IOnchainSendResponse
    ): api.OnchainSendResponse;

    /**
     * Encodes the specified OnchainSendResponse message. Does not implicitly {@link api.OnchainSendResponse.verify|verify} messages.
     * @param message OnchainSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOnchainSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OnchainSendResponse message, length delimited. Does not implicitly {@link api.OnchainSendResponse.verify|verify} messages.
     * @param message OnchainSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOnchainSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OnchainSendResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OnchainSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OnchainSendResponse;

    /**
     * Decodes an OnchainSendResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OnchainSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OnchainSendResponse;

    /**
     * Verifies an OnchainSendResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OnchainSendResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OnchainSendResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OnchainSendResponse;

    /**
     * Creates a plain object from an OnchainSendResponse message. Also converts values to other types if specified.
     * @param message OnchainSendResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OnchainSendResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OnchainSendResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OnchainSendResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveRequest. */
  interface IBolt11ReceiveRequest {
    /** Bolt11ReceiveRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt11ReceiveRequest description */
    description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveRequest expirySecs */
    expirySecs?: number | null;
  }

  /** Represents a Bolt11ReceiveRequest. */
  class Bolt11ReceiveRequest implements IBolt11ReceiveRequest {
    /**
     * Constructs a new Bolt11ReceiveRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveRequest);

    /** Bolt11ReceiveRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** Bolt11ReceiveRequest description. */
    public description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveRequest expirySecs. */
    public expirySecs: number;

    /**
     * Creates a new Bolt11ReceiveRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveRequest instance
     */
    public static create(
      properties?: api.IBolt11ReceiveRequest
    ): api.Bolt11ReceiveRequest;

    /**
     * Encodes the specified Bolt11ReceiveRequest message. Does not implicitly {@link api.Bolt11ReceiveRequest.verify|verify} messages.
     * @param message Bolt11ReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveRequest message, length delimited. Does not implicitly {@link api.Bolt11ReceiveRequest.verify|verify} messages.
     * @param message Bolt11ReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveRequest;

    /**
     * Decodes a Bolt11ReceiveRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveRequest;

    /**
     * Verifies a Bolt11ReceiveRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveRequest;

    /**
     * Creates a plain object from a Bolt11ReceiveRequest message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveResponse. */
  interface IBolt11ReceiveResponse {
    /** Bolt11ReceiveResponse invoice */
    invoice?: string | null;

    /** Bolt11ReceiveResponse paymentHash */
    paymentHash?: string | null;

    /** Bolt11ReceiveResponse paymentSecret */
    paymentSecret?: string | null;
  }

  /** Represents a Bolt11ReceiveResponse. */
  class Bolt11ReceiveResponse implements IBolt11ReceiveResponse {
    /**
     * Constructs a new Bolt11ReceiveResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveResponse);

    /** Bolt11ReceiveResponse invoice. */
    public invoice: string;

    /** Bolt11ReceiveResponse paymentHash. */
    public paymentHash: string;

    /** Bolt11ReceiveResponse paymentSecret. */
    public paymentSecret: string;

    /**
     * Creates a new Bolt11ReceiveResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveResponse instance
     */
    public static create(
      properties?: api.IBolt11ReceiveResponse
    ): api.Bolt11ReceiveResponse;

    /**
     * Encodes the specified Bolt11ReceiveResponse message. Does not implicitly {@link api.Bolt11ReceiveResponse.verify|verify} messages.
     * @param message Bolt11ReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveResponse message, length delimited. Does not implicitly {@link api.Bolt11ReceiveResponse.verify|verify} messages.
     * @param message Bolt11ReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveResponse;

    /**
     * Decodes a Bolt11ReceiveResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveResponse;

    /**
     * Verifies a Bolt11ReceiveResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveResponse;

    /**
     * Creates a plain object from a Bolt11ReceiveResponse message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveForHashRequest. */
  interface IBolt11ReceiveForHashRequest {
    /** Bolt11ReceiveForHashRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt11ReceiveForHashRequest description */
    description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveForHashRequest expirySecs */
    expirySecs?: number | null;

    /** Bolt11ReceiveForHashRequest paymentHash */
    paymentHash?: string | null;
  }

  /** Represents a Bolt11ReceiveForHashRequest. */
  class Bolt11ReceiveForHashRequest implements IBolt11ReceiveForHashRequest {
    /**
     * Constructs a new Bolt11ReceiveForHashRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveForHashRequest);

    /** Bolt11ReceiveForHashRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** Bolt11ReceiveForHashRequest description. */
    public description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveForHashRequest expirySecs. */
    public expirySecs: number;

    /** Bolt11ReceiveForHashRequest paymentHash. */
    public paymentHash: string;

    /**
     * Creates a new Bolt11ReceiveForHashRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveForHashRequest instance
     */
    public static create(
      properties?: api.IBolt11ReceiveForHashRequest
    ): api.Bolt11ReceiveForHashRequest;

    /**
     * Encodes the specified Bolt11ReceiveForHashRequest message. Does not implicitly {@link api.Bolt11ReceiveForHashRequest.verify|verify} messages.
     * @param message Bolt11ReceiveForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveForHashRequest message, length delimited. Does not implicitly {@link api.Bolt11ReceiveForHashRequest.verify|verify} messages.
     * @param message Bolt11ReceiveForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveForHashRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveForHashRequest;

    /**
     * Decodes a Bolt11ReceiveForHashRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveForHashRequest;

    /**
     * Verifies a Bolt11ReceiveForHashRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveForHashRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveForHashRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveForHashRequest;

    /**
     * Creates a plain object from a Bolt11ReceiveForHashRequest message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveForHashRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveForHashRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveForHashRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveForHashRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveForHashResponse. */
  interface IBolt11ReceiveForHashResponse {
    /** Bolt11ReceiveForHashResponse invoice */
    invoice?: string | null;
  }

  /** Represents a Bolt11ReceiveForHashResponse. */
  class Bolt11ReceiveForHashResponse implements IBolt11ReceiveForHashResponse {
    /**
     * Constructs a new Bolt11ReceiveForHashResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveForHashResponse);

    /** Bolt11ReceiveForHashResponse invoice. */
    public invoice: string;

    /**
     * Creates a new Bolt11ReceiveForHashResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveForHashResponse instance
     */
    public static create(
      properties?: api.IBolt11ReceiveForHashResponse
    ): api.Bolt11ReceiveForHashResponse;

    /**
     * Encodes the specified Bolt11ReceiveForHashResponse message. Does not implicitly {@link api.Bolt11ReceiveForHashResponse.verify|verify} messages.
     * @param message Bolt11ReceiveForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveForHashResponse message, length delimited. Does not implicitly {@link api.Bolt11ReceiveForHashResponse.verify|verify} messages.
     * @param message Bolt11ReceiveForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveForHashResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveForHashResponse;

    /**
     * Decodes a Bolt11ReceiveForHashResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveForHashResponse;

    /**
     * Verifies a Bolt11ReceiveForHashResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveForHashResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveForHashResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveForHashResponse;

    /**
     * Creates a plain object from a Bolt11ReceiveForHashResponse message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveForHashResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveForHashResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveForHashResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveForHashResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ClaimForHashRequest. */
  interface IBolt11ClaimForHashRequest {
    /** Bolt11ClaimForHashRequest paymentHash */
    paymentHash?: string | null;

    /** Bolt11ClaimForHashRequest claimableAmountMsat */
    claimableAmountMsat?: number | Long | null;

    /** Bolt11ClaimForHashRequest preimage */
    preimage?: string | null;
  }

  /** Represents a Bolt11ClaimForHashRequest. */
  class Bolt11ClaimForHashRequest implements IBolt11ClaimForHashRequest {
    /**
     * Constructs a new Bolt11ClaimForHashRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ClaimForHashRequest);

    /** Bolt11ClaimForHashRequest paymentHash. */
    public paymentHash?: string | null;

    /** Bolt11ClaimForHashRequest claimableAmountMsat. */
    public claimableAmountMsat?: number | Long | null;

    /** Bolt11ClaimForHashRequest preimage. */
    public preimage: string;

    /**
     * Creates a new Bolt11ClaimForHashRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ClaimForHashRequest instance
     */
    public static create(
      properties?: api.IBolt11ClaimForHashRequest
    ): api.Bolt11ClaimForHashRequest;

    /**
     * Encodes the specified Bolt11ClaimForHashRequest message. Does not implicitly {@link api.Bolt11ClaimForHashRequest.verify|verify} messages.
     * @param message Bolt11ClaimForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ClaimForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ClaimForHashRequest message, length delimited. Does not implicitly {@link api.Bolt11ClaimForHashRequest.verify|verify} messages.
     * @param message Bolt11ClaimForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ClaimForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ClaimForHashRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ClaimForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ClaimForHashRequest;

    /**
     * Decodes a Bolt11ClaimForHashRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ClaimForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ClaimForHashRequest;

    /**
     * Verifies a Bolt11ClaimForHashRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ClaimForHashRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ClaimForHashRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ClaimForHashRequest;

    /**
     * Creates a plain object from a Bolt11ClaimForHashRequest message. Also converts values to other types if specified.
     * @param message Bolt11ClaimForHashRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ClaimForHashRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ClaimForHashRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ClaimForHashRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ClaimForHashResponse. */
  interface IBolt11ClaimForHashResponse {}

  /** Represents a Bolt11ClaimForHashResponse. */
  class Bolt11ClaimForHashResponse implements IBolt11ClaimForHashResponse {
    /**
     * Constructs a new Bolt11ClaimForHashResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ClaimForHashResponse);

    /**
     * Creates a new Bolt11ClaimForHashResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ClaimForHashResponse instance
     */
    public static create(
      properties?: api.IBolt11ClaimForHashResponse
    ): api.Bolt11ClaimForHashResponse;

    /**
     * Encodes the specified Bolt11ClaimForHashResponse message. Does not implicitly {@link api.Bolt11ClaimForHashResponse.verify|verify} messages.
     * @param message Bolt11ClaimForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ClaimForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ClaimForHashResponse message, length delimited. Does not implicitly {@link api.Bolt11ClaimForHashResponse.verify|verify} messages.
     * @param message Bolt11ClaimForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ClaimForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ClaimForHashResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ClaimForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ClaimForHashResponse;

    /**
     * Decodes a Bolt11ClaimForHashResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ClaimForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ClaimForHashResponse;

    /**
     * Verifies a Bolt11ClaimForHashResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ClaimForHashResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ClaimForHashResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ClaimForHashResponse;

    /**
     * Creates a plain object from a Bolt11ClaimForHashResponse message. Also converts values to other types if specified.
     * @param message Bolt11ClaimForHashResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ClaimForHashResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ClaimForHashResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ClaimForHashResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11FailForHashRequest. */
  interface IBolt11FailForHashRequest {
    /** Bolt11FailForHashRequest paymentHash */
    paymentHash?: string | null;
  }

  /** Represents a Bolt11FailForHashRequest. */
  class Bolt11FailForHashRequest implements IBolt11FailForHashRequest {
    /**
     * Constructs a new Bolt11FailForHashRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11FailForHashRequest);

    /** Bolt11FailForHashRequest paymentHash. */
    public paymentHash: string;

    /**
     * Creates a new Bolt11FailForHashRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11FailForHashRequest instance
     */
    public static create(
      properties?: api.IBolt11FailForHashRequest
    ): api.Bolt11FailForHashRequest;

    /**
     * Encodes the specified Bolt11FailForHashRequest message. Does not implicitly {@link api.Bolt11FailForHashRequest.verify|verify} messages.
     * @param message Bolt11FailForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11FailForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11FailForHashRequest message, length delimited. Does not implicitly {@link api.Bolt11FailForHashRequest.verify|verify} messages.
     * @param message Bolt11FailForHashRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11FailForHashRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11FailForHashRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11FailForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11FailForHashRequest;

    /**
     * Decodes a Bolt11FailForHashRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11FailForHashRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11FailForHashRequest;

    /**
     * Verifies a Bolt11FailForHashRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11FailForHashRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11FailForHashRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11FailForHashRequest;

    /**
     * Creates a plain object from a Bolt11FailForHashRequest message. Also converts values to other types if specified.
     * @param message Bolt11FailForHashRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11FailForHashRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11FailForHashRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11FailForHashRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11FailForHashResponse. */
  interface IBolt11FailForHashResponse {}

  /** Represents a Bolt11FailForHashResponse. */
  class Bolt11FailForHashResponse implements IBolt11FailForHashResponse {
    /**
     * Constructs a new Bolt11FailForHashResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11FailForHashResponse);

    /**
     * Creates a new Bolt11FailForHashResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11FailForHashResponse instance
     */
    public static create(
      properties?: api.IBolt11FailForHashResponse
    ): api.Bolt11FailForHashResponse;

    /**
     * Encodes the specified Bolt11FailForHashResponse message. Does not implicitly {@link api.Bolt11FailForHashResponse.verify|verify} messages.
     * @param message Bolt11FailForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11FailForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11FailForHashResponse message, length delimited. Does not implicitly {@link api.Bolt11FailForHashResponse.verify|verify} messages.
     * @param message Bolt11FailForHashResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11FailForHashResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11FailForHashResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11FailForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11FailForHashResponse;

    /**
     * Decodes a Bolt11FailForHashResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11FailForHashResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11FailForHashResponse;

    /**
     * Verifies a Bolt11FailForHashResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11FailForHashResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11FailForHashResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11FailForHashResponse;

    /**
     * Creates a plain object from a Bolt11FailForHashResponse message. Also converts values to other types if specified.
     * @param message Bolt11FailForHashResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11FailForHashResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11FailForHashResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11FailForHashResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveViaJitChannelRequest. */
  interface IBolt11ReceiveViaJitChannelRequest {
    /** Bolt11ReceiveViaJitChannelRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt11ReceiveViaJitChannelRequest description */
    description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveViaJitChannelRequest expirySecs */
    expirySecs?: number | null;

    /** Bolt11ReceiveViaJitChannelRequest maxTotalLspFeeLimitMsat */
    maxTotalLspFeeLimitMsat?: number | Long | null;
  }

  /** Represents a Bolt11ReceiveViaJitChannelRequest. */
  class Bolt11ReceiveViaJitChannelRequest implements IBolt11ReceiveViaJitChannelRequest {
    /**
     * Constructs a new Bolt11ReceiveViaJitChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveViaJitChannelRequest);

    /** Bolt11ReceiveViaJitChannelRequest amountMsat. */
    public amountMsat: number | Long;

    /** Bolt11ReceiveViaJitChannelRequest description. */
    public description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveViaJitChannelRequest expirySecs. */
    public expirySecs: number;

    /** Bolt11ReceiveViaJitChannelRequest maxTotalLspFeeLimitMsat. */
    public maxTotalLspFeeLimitMsat?: number | Long | null;

    /**
     * Creates a new Bolt11ReceiveViaJitChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveViaJitChannelRequest instance
     */
    public static create(
      properties?: api.IBolt11ReceiveViaJitChannelRequest
    ): api.Bolt11ReceiveViaJitChannelRequest;

    /**
     * Encodes the specified Bolt11ReceiveViaJitChannelRequest message. Does not implicitly {@link api.Bolt11ReceiveViaJitChannelRequest.verify|verify} messages.
     * @param message Bolt11ReceiveViaJitChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveViaJitChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveViaJitChannelRequest message, length delimited. Does not implicitly {@link api.Bolt11ReceiveViaJitChannelRequest.verify|verify} messages.
     * @param message Bolt11ReceiveViaJitChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveViaJitChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveViaJitChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveViaJitChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveViaJitChannelRequest;

    /**
     * Decodes a Bolt11ReceiveViaJitChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveViaJitChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveViaJitChannelRequest;

    /**
     * Verifies a Bolt11ReceiveViaJitChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveViaJitChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveViaJitChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveViaJitChannelRequest;

    /**
     * Creates a plain object from a Bolt11ReceiveViaJitChannelRequest message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveViaJitChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveViaJitChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveViaJitChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveViaJitChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveViaJitChannelResponse. */
  interface IBolt11ReceiveViaJitChannelResponse {
    /** Bolt11ReceiveViaJitChannelResponse invoice */
    invoice?: string | null;
  }

  /** Represents a Bolt11ReceiveViaJitChannelResponse. */
  class Bolt11ReceiveViaJitChannelResponse implements IBolt11ReceiveViaJitChannelResponse {
    /**
     * Constructs a new Bolt11ReceiveViaJitChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11ReceiveViaJitChannelResponse);

    /** Bolt11ReceiveViaJitChannelResponse invoice. */
    public invoice: string;

    /**
     * Creates a new Bolt11ReceiveViaJitChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveViaJitChannelResponse instance
     */
    public static create(
      properties?: api.IBolt11ReceiveViaJitChannelResponse
    ): api.Bolt11ReceiveViaJitChannelResponse;

    /**
     * Encodes the specified Bolt11ReceiveViaJitChannelResponse message. Does not implicitly {@link api.Bolt11ReceiveViaJitChannelResponse.verify|verify} messages.
     * @param message Bolt11ReceiveViaJitChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveViaJitChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveViaJitChannelResponse message, length delimited. Does not implicitly {@link api.Bolt11ReceiveViaJitChannelResponse.verify|verify} messages.
     * @param message Bolt11ReceiveViaJitChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveViaJitChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveViaJitChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveViaJitChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveViaJitChannelResponse;

    /**
     * Decodes a Bolt11ReceiveViaJitChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveViaJitChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveViaJitChannelResponse;

    /**
     * Verifies a Bolt11ReceiveViaJitChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveViaJitChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveViaJitChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveViaJitChannelResponse;

    /**
     * Creates a plain object from a Bolt11ReceiveViaJitChannelResponse message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveViaJitChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveViaJitChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveViaJitChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveViaJitChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveVariableAmountViaJitChannelRequest. */
  interface IBolt11ReceiveVariableAmountViaJitChannelRequest {
    /** Bolt11ReceiveVariableAmountViaJitChannelRequest description */
    description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveVariableAmountViaJitChannelRequest expirySecs */
    expirySecs?: number | null;

    /** Bolt11ReceiveVariableAmountViaJitChannelRequest maxProportionalLspFeeLimitPpmMsat */
    maxProportionalLspFeeLimitPpmMsat?: number | Long | null;
  }

  /** Represents a Bolt11ReceiveVariableAmountViaJitChannelRequest. */
  class Bolt11ReceiveVariableAmountViaJitChannelRequest implements IBolt11ReceiveVariableAmountViaJitChannelRequest {
    /**
     * Constructs a new Bolt11ReceiveVariableAmountViaJitChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(
      properties?: api.IBolt11ReceiveVariableAmountViaJitChannelRequest
    );

    /** Bolt11ReceiveVariableAmountViaJitChannelRequest description. */
    public description?: types.IBolt11InvoiceDescription | null;

    /** Bolt11ReceiveVariableAmountViaJitChannelRequest expirySecs. */
    public expirySecs: number;

    /** Bolt11ReceiveVariableAmountViaJitChannelRequest maxProportionalLspFeeLimitPpmMsat. */
    public maxProportionalLspFeeLimitPpmMsat?: number | Long | null;

    /**
     * Creates a new Bolt11ReceiveVariableAmountViaJitChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveVariableAmountViaJitChannelRequest instance
     */
    public static create(
      properties?: api.IBolt11ReceiveVariableAmountViaJitChannelRequest
    ): api.Bolt11ReceiveVariableAmountViaJitChannelRequest;

    /**
     * Encodes the specified Bolt11ReceiveVariableAmountViaJitChannelRequest message. Does not implicitly {@link api.Bolt11ReceiveVariableAmountViaJitChannelRequest.verify|verify} messages.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveVariableAmountViaJitChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveVariableAmountViaJitChannelRequest message, length delimited. Does not implicitly {@link api.Bolt11ReceiveVariableAmountViaJitChannelRequest.verify|verify} messages.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveVariableAmountViaJitChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveVariableAmountViaJitChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveVariableAmountViaJitChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveVariableAmountViaJitChannelRequest;

    /**
     * Decodes a Bolt11ReceiveVariableAmountViaJitChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveVariableAmountViaJitChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveVariableAmountViaJitChannelRequest;

    /**
     * Verifies a Bolt11ReceiveVariableAmountViaJitChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveVariableAmountViaJitChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveVariableAmountViaJitChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveVariableAmountViaJitChannelRequest;

    /**
     * Creates a plain object from a Bolt11ReceiveVariableAmountViaJitChannelRequest message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveVariableAmountViaJitChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveVariableAmountViaJitChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveVariableAmountViaJitChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11ReceiveVariableAmountViaJitChannelResponse. */
  interface IBolt11ReceiveVariableAmountViaJitChannelResponse {
    /** Bolt11ReceiveVariableAmountViaJitChannelResponse invoice */
    invoice?: string | null;
  }

  /** Represents a Bolt11ReceiveVariableAmountViaJitChannelResponse. */
  class Bolt11ReceiveVariableAmountViaJitChannelResponse implements IBolt11ReceiveVariableAmountViaJitChannelResponse {
    /**
     * Constructs a new Bolt11ReceiveVariableAmountViaJitChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(
      properties?: api.IBolt11ReceiveVariableAmountViaJitChannelResponse
    );

    /** Bolt11ReceiveVariableAmountViaJitChannelResponse invoice. */
    public invoice: string;

    /**
     * Creates a new Bolt11ReceiveVariableAmountViaJitChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11ReceiveVariableAmountViaJitChannelResponse instance
     */
    public static create(
      properties?: api.IBolt11ReceiveVariableAmountViaJitChannelResponse
    ): api.Bolt11ReceiveVariableAmountViaJitChannelResponse;

    /**
     * Encodes the specified Bolt11ReceiveVariableAmountViaJitChannelResponse message. Does not implicitly {@link api.Bolt11ReceiveVariableAmountViaJitChannelResponse.verify|verify} messages.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11ReceiveVariableAmountViaJitChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11ReceiveVariableAmountViaJitChannelResponse message, length delimited. Does not implicitly {@link api.Bolt11ReceiveVariableAmountViaJitChannelResponse.verify|verify} messages.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11ReceiveVariableAmountViaJitChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11ReceiveVariableAmountViaJitChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11ReceiveVariableAmountViaJitChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11ReceiveVariableAmountViaJitChannelResponse;

    /**
     * Decodes a Bolt11ReceiveVariableAmountViaJitChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11ReceiveVariableAmountViaJitChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11ReceiveVariableAmountViaJitChannelResponse;

    /**
     * Verifies a Bolt11ReceiveVariableAmountViaJitChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11ReceiveVariableAmountViaJitChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11ReceiveVariableAmountViaJitChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11ReceiveVariableAmountViaJitChannelResponse;

    /**
     * Creates a plain object from a Bolt11ReceiveVariableAmountViaJitChannelResponse message. Also converts values to other types if specified.
     * @param message Bolt11ReceiveVariableAmountViaJitChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11ReceiveVariableAmountViaJitChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11ReceiveVariableAmountViaJitChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11ReceiveVariableAmountViaJitChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11SendRequest. */
  interface IBolt11SendRequest {
    /** Bolt11SendRequest invoice */
    invoice?: string | null;

    /** Bolt11SendRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt11SendRequest routeParameters */
    routeParameters?: types.IRouteParametersConfig | null;
  }

  /** Represents a Bolt11SendRequest. */
  class Bolt11SendRequest implements IBolt11SendRequest {
    /**
     * Constructs a new Bolt11SendRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11SendRequest);

    /** Bolt11SendRequest invoice. */
    public invoice: string;

    /** Bolt11SendRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** Bolt11SendRequest routeParameters. */
    public routeParameters?: types.IRouteParametersConfig | null;

    /**
     * Creates a new Bolt11SendRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11SendRequest instance
     */
    public static create(
      properties?: api.IBolt11SendRequest
    ): api.Bolt11SendRequest;

    /**
     * Encodes the specified Bolt11SendRequest message. Does not implicitly {@link api.Bolt11SendRequest.verify|verify} messages.
     * @param message Bolt11SendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11SendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11SendRequest message, length delimited. Does not implicitly {@link api.Bolt11SendRequest.verify|verify} messages.
     * @param message Bolt11SendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11SendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11SendRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11SendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11SendRequest;

    /**
     * Decodes a Bolt11SendRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11SendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11SendRequest;

    /**
     * Verifies a Bolt11SendRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11SendRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11SendRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11SendRequest;

    /**
     * Creates a plain object from a Bolt11SendRequest message. Also converts values to other types if specified.
     * @param message Bolt11SendRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11SendRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11SendRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11SendRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11SendResponse. */
  interface IBolt11SendResponse {
    /** Bolt11SendResponse paymentId */
    paymentId?: string | null;
  }

  /** Represents a Bolt11SendResponse. */
  class Bolt11SendResponse implements IBolt11SendResponse {
    /**
     * Constructs a new Bolt11SendResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt11SendResponse);

    /** Bolt11SendResponse paymentId. */
    public paymentId: string;

    /**
     * Creates a new Bolt11SendResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11SendResponse instance
     */
    public static create(
      properties?: api.IBolt11SendResponse
    ): api.Bolt11SendResponse;

    /**
     * Encodes the specified Bolt11SendResponse message. Does not implicitly {@link api.Bolt11SendResponse.verify|verify} messages.
     * @param message Bolt11SendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt11SendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11SendResponse message, length delimited. Does not implicitly {@link api.Bolt11SendResponse.verify|verify} messages.
     * @param message Bolt11SendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt11SendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11SendResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11SendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt11SendResponse;

    /**
     * Decodes a Bolt11SendResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11SendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt11SendResponse;

    /**
     * Verifies a Bolt11SendResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11SendResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11SendResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt11SendResponse;

    /**
     * Creates a plain object from a Bolt11SendResponse message. Also converts values to other types if specified.
     * @param message Bolt11SendResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt11SendResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11SendResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11SendResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12ReceiveRequest. */
  interface IBolt12ReceiveRequest {
    /** Bolt12ReceiveRequest description */
    description?: string | null;

    /** Bolt12ReceiveRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt12ReceiveRequest expirySecs */
    expirySecs?: number | null;

    /** Bolt12ReceiveRequest quantity */
    quantity?: number | Long | null;
  }

  /** Represents a Bolt12ReceiveRequest. */
  class Bolt12ReceiveRequest implements IBolt12ReceiveRequest {
    /**
     * Constructs a new Bolt12ReceiveRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt12ReceiveRequest);

    /** Bolt12ReceiveRequest description. */
    public description: string;

    /** Bolt12ReceiveRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** Bolt12ReceiveRequest expirySecs. */
    public expirySecs?: number | null;

    /** Bolt12ReceiveRequest quantity. */
    public quantity?: number | Long | null;

    /**
     * Creates a new Bolt12ReceiveRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12ReceiveRequest instance
     */
    public static create(
      properties?: api.IBolt12ReceiveRequest
    ): api.Bolt12ReceiveRequest;

    /**
     * Encodes the specified Bolt12ReceiveRequest message. Does not implicitly {@link api.Bolt12ReceiveRequest.verify|verify} messages.
     * @param message Bolt12ReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt12ReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12ReceiveRequest message, length delimited. Does not implicitly {@link api.Bolt12ReceiveRequest.verify|verify} messages.
     * @param message Bolt12ReceiveRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt12ReceiveRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12ReceiveRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12ReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt12ReceiveRequest;

    /**
     * Decodes a Bolt12ReceiveRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12ReceiveRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt12ReceiveRequest;

    /**
     * Verifies a Bolt12ReceiveRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12ReceiveRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12ReceiveRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt12ReceiveRequest;

    /**
     * Creates a plain object from a Bolt12ReceiveRequest message. Also converts values to other types if specified.
     * @param message Bolt12ReceiveRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt12ReceiveRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12ReceiveRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12ReceiveRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12ReceiveResponse. */
  interface IBolt12ReceiveResponse {
    /** Bolt12ReceiveResponse offer */
    offer?: string | null;

    /** Bolt12ReceiveResponse offerId */
    offerId?: string | null;
  }

  /** Represents a Bolt12ReceiveResponse. */
  class Bolt12ReceiveResponse implements IBolt12ReceiveResponse {
    /**
     * Constructs a new Bolt12ReceiveResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt12ReceiveResponse);

    /** Bolt12ReceiveResponse offer. */
    public offer: string;

    /** Bolt12ReceiveResponse offerId. */
    public offerId: string;

    /**
     * Creates a new Bolt12ReceiveResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12ReceiveResponse instance
     */
    public static create(
      properties?: api.IBolt12ReceiveResponse
    ): api.Bolt12ReceiveResponse;

    /**
     * Encodes the specified Bolt12ReceiveResponse message. Does not implicitly {@link api.Bolt12ReceiveResponse.verify|verify} messages.
     * @param message Bolt12ReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt12ReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12ReceiveResponse message, length delimited. Does not implicitly {@link api.Bolt12ReceiveResponse.verify|verify} messages.
     * @param message Bolt12ReceiveResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt12ReceiveResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12ReceiveResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12ReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt12ReceiveResponse;

    /**
     * Decodes a Bolt12ReceiveResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12ReceiveResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt12ReceiveResponse;

    /**
     * Verifies a Bolt12ReceiveResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12ReceiveResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12ReceiveResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt12ReceiveResponse;

    /**
     * Creates a plain object from a Bolt12ReceiveResponse message. Also converts values to other types if specified.
     * @param message Bolt12ReceiveResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt12ReceiveResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12ReceiveResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12ReceiveResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12SendRequest. */
  interface IBolt12SendRequest {
    /** Bolt12SendRequest offer */
    offer?: string | null;

    /** Bolt12SendRequest amountMsat */
    amountMsat?: number | Long | null;

    /** Bolt12SendRequest quantity */
    quantity?: number | Long | null;

    /** Bolt12SendRequest payerNote */
    payerNote?: string | null;

    /** Bolt12SendRequest routeParameters */
    routeParameters?: types.IRouteParametersConfig | null;
  }

  /** Represents a Bolt12SendRequest. */
  class Bolt12SendRequest implements IBolt12SendRequest {
    /**
     * Constructs a new Bolt12SendRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt12SendRequest);

    /** Bolt12SendRequest offer. */
    public offer: string;

    /** Bolt12SendRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** Bolt12SendRequest quantity. */
    public quantity?: number | Long | null;

    /** Bolt12SendRequest payerNote. */
    public payerNote?: string | null;

    /** Bolt12SendRequest routeParameters. */
    public routeParameters?: types.IRouteParametersConfig | null;

    /**
     * Creates a new Bolt12SendRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12SendRequest instance
     */
    public static create(
      properties?: api.IBolt12SendRequest
    ): api.Bolt12SendRequest;

    /**
     * Encodes the specified Bolt12SendRequest message. Does not implicitly {@link api.Bolt12SendRequest.verify|verify} messages.
     * @param message Bolt12SendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt12SendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12SendRequest message, length delimited. Does not implicitly {@link api.Bolt12SendRequest.verify|verify} messages.
     * @param message Bolt12SendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt12SendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12SendRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12SendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt12SendRequest;

    /**
     * Decodes a Bolt12SendRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12SendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt12SendRequest;

    /**
     * Verifies a Bolt12SendRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12SendRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12SendRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt12SendRequest;

    /**
     * Creates a plain object from a Bolt12SendRequest message. Also converts values to other types if specified.
     * @param message Bolt12SendRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt12SendRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12SendRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12SendRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12SendResponse. */
  interface IBolt12SendResponse {
    /** Bolt12SendResponse paymentId */
    paymentId?: string | null;
  }

  /** Represents a Bolt12SendResponse. */
  class Bolt12SendResponse implements IBolt12SendResponse {
    /**
     * Constructs a new Bolt12SendResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IBolt12SendResponse);

    /** Bolt12SendResponse paymentId. */
    public paymentId: string;

    /**
     * Creates a new Bolt12SendResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12SendResponse instance
     */
    public static create(
      properties?: api.IBolt12SendResponse
    ): api.Bolt12SendResponse;

    /**
     * Encodes the specified Bolt12SendResponse message. Does not implicitly {@link api.Bolt12SendResponse.verify|verify} messages.
     * @param message Bolt12SendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IBolt12SendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12SendResponse message, length delimited. Does not implicitly {@link api.Bolt12SendResponse.verify|verify} messages.
     * @param message Bolt12SendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IBolt12SendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12SendResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12SendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.Bolt12SendResponse;

    /**
     * Decodes a Bolt12SendResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12SendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.Bolt12SendResponse;

    /**
     * Verifies a Bolt12SendResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12SendResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12SendResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.Bolt12SendResponse;

    /**
     * Creates a plain object from a Bolt12SendResponse message. Also converts values to other types if specified.
     * @param message Bolt12SendResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.Bolt12SendResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12SendResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12SendResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpontaneousSendRequest. */
  interface ISpontaneousSendRequest {
    /** SpontaneousSendRequest amountMsat */
    amountMsat?: number | Long | null;

    /** SpontaneousSendRequest nodeId */
    nodeId?: string | null;

    /** SpontaneousSendRequest routeParameters */
    routeParameters?: types.IRouteParametersConfig | null;
  }

  /** Represents a SpontaneousSendRequest. */
  class SpontaneousSendRequest implements ISpontaneousSendRequest {
    /**
     * Constructs a new SpontaneousSendRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpontaneousSendRequest);

    /** SpontaneousSendRequest amountMsat. */
    public amountMsat: number | Long;

    /** SpontaneousSendRequest nodeId. */
    public nodeId: string;

    /** SpontaneousSendRequest routeParameters. */
    public routeParameters?: types.IRouteParametersConfig | null;

    /**
     * Creates a new SpontaneousSendRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpontaneousSendRequest instance
     */
    public static create(
      properties?: api.ISpontaneousSendRequest
    ): api.SpontaneousSendRequest;

    /**
     * Encodes the specified SpontaneousSendRequest message. Does not implicitly {@link api.SpontaneousSendRequest.verify|verify} messages.
     * @param message SpontaneousSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpontaneousSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpontaneousSendRequest message, length delimited. Does not implicitly {@link api.SpontaneousSendRequest.verify|verify} messages.
     * @param message SpontaneousSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpontaneousSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpontaneousSendRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpontaneousSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpontaneousSendRequest;

    /**
     * Decodes a SpontaneousSendRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpontaneousSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpontaneousSendRequest;

    /**
     * Verifies a SpontaneousSendRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpontaneousSendRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpontaneousSendRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SpontaneousSendRequest;

    /**
     * Creates a plain object from a SpontaneousSendRequest message. Also converts values to other types if specified.
     * @param message SpontaneousSendRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpontaneousSendRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpontaneousSendRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpontaneousSendRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpontaneousSendResponse. */
  interface ISpontaneousSendResponse {
    /** SpontaneousSendResponse paymentId */
    paymentId?: string | null;
  }

  /** Represents a SpontaneousSendResponse. */
  class SpontaneousSendResponse implements ISpontaneousSendResponse {
    /**
     * Constructs a new SpontaneousSendResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpontaneousSendResponse);

    /** SpontaneousSendResponse paymentId. */
    public paymentId: string;

    /**
     * Creates a new SpontaneousSendResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpontaneousSendResponse instance
     */
    public static create(
      properties?: api.ISpontaneousSendResponse
    ): api.SpontaneousSendResponse;

    /**
     * Encodes the specified SpontaneousSendResponse message. Does not implicitly {@link api.SpontaneousSendResponse.verify|verify} messages.
     * @param message SpontaneousSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpontaneousSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpontaneousSendResponse message, length delimited. Does not implicitly {@link api.SpontaneousSendResponse.verify|verify} messages.
     * @param message SpontaneousSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpontaneousSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpontaneousSendResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpontaneousSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpontaneousSendResponse;

    /**
     * Decodes a SpontaneousSendResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpontaneousSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpontaneousSendResponse;

    /**
     * Verifies a SpontaneousSendResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpontaneousSendResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpontaneousSendResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SpontaneousSendResponse;

    /**
     * Creates a plain object from a SpontaneousSendResponse message. Also converts values to other types if specified.
     * @param message SpontaneousSendResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpontaneousSendResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpontaneousSendResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpontaneousSendResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OpenChannelRequest. */
  interface IOpenChannelRequest {
    /** OpenChannelRequest nodePubkey */
    nodePubkey?: string | null;

    /** OpenChannelRequest address */
    address?: string | null;

    /** OpenChannelRequest channelAmountSats */
    channelAmountSats?: number | Long | null;

    /** OpenChannelRequest pushToCounterpartyMsat */
    pushToCounterpartyMsat?: number | Long | null;

    /** OpenChannelRequest channelConfig */
    channelConfig?: types.IChannelConfig | null;

    /** OpenChannelRequest announceChannel */
    announceChannel?: boolean | null;
  }

  /** Represents an OpenChannelRequest. */
  class OpenChannelRequest implements IOpenChannelRequest {
    /**
     * Constructs a new OpenChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOpenChannelRequest);

    /** OpenChannelRequest nodePubkey. */
    public nodePubkey: string;

    /** OpenChannelRequest address. */
    public address: string;

    /** OpenChannelRequest channelAmountSats. */
    public channelAmountSats: number | Long;

    /** OpenChannelRequest pushToCounterpartyMsat. */
    public pushToCounterpartyMsat?: number | Long | null;

    /** OpenChannelRequest channelConfig. */
    public channelConfig?: types.IChannelConfig | null;

    /** OpenChannelRequest announceChannel. */
    public announceChannel: boolean;

    /**
     * Creates a new OpenChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OpenChannelRequest instance
     */
    public static create(
      properties?: api.IOpenChannelRequest
    ): api.OpenChannelRequest;

    /**
     * Encodes the specified OpenChannelRequest message. Does not implicitly {@link api.OpenChannelRequest.verify|verify} messages.
     * @param message OpenChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOpenChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OpenChannelRequest message, length delimited. Does not implicitly {@link api.OpenChannelRequest.verify|verify} messages.
     * @param message OpenChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOpenChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OpenChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OpenChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OpenChannelRequest;

    /**
     * Decodes an OpenChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OpenChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OpenChannelRequest;

    /**
     * Verifies an OpenChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OpenChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OpenChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OpenChannelRequest;

    /**
     * Creates a plain object from an OpenChannelRequest message. Also converts values to other types if specified.
     * @param message OpenChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OpenChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OpenChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OpenChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OpenChannelResponse. */
  interface IOpenChannelResponse {
    /** OpenChannelResponse userChannelId */
    userChannelId?: string | null;
  }

  /** Represents an OpenChannelResponse. */
  class OpenChannelResponse implements IOpenChannelResponse {
    /**
     * Constructs a new OpenChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IOpenChannelResponse);

    /** OpenChannelResponse userChannelId. */
    public userChannelId: string;

    /**
     * Creates a new OpenChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OpenChannelResponse instance
     */
    public static create(
      properties?: api.IOpenChannelResponse
    ): api.OpenChannelResponse;

    /**
     * Encodes the specified OpenChannelResponse message. Does not implicitly {@link api.OpenChannelResponse.verify|verify} messages.
     * @param message OpenChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IOpenChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OpenChannelResponse message, length delimited. Does not implicitly {@link api.OpenChannelResponse.verify|verify} messages.
     * @param message OpenChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IOpenChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OpenChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OpenChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.OpenChannelResponse;

    /**
     * Decodes an OpenChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OpenChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.OpenChannelResponse;

    /**
     * Verifies an OpenChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OpenChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OpenChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.OpenChannelResponse;

    /**
     * Creates a plain object from an OpenChannelResponse message. Also converts values to other types if specified.
     * @param message OpenChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.OpenChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OpenChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OpenChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpliceInRequest. */
  interface ISpliceInRequest {
    /** SpliceInRequest userChannelId */
    userChannelId?: string | null;

    /** SpliceInRequest counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** SpliceInRequest spliceAmountSats */
    spliceAmountSats?: number | Long | null;
  }

  /** Represents a SpliceInRequest. */
  class SpliceInRequest implements ISpliceInRequest {
    /**
     * Constructs a new SpliceInRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpliceInRequest);

    /** SpliceInRequest userChannelId. */
    public userChannelId: string;

    /** SpliceInRequest counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** SpliceInRequest spliceAmountSats. */
    public spliceAmountSats: number | Long;

    /**
     * Creates a new SpliceInRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpliceInRequest instance
     */
    public static create(
      properties?: api.ISpliceInRequest
    ): api.SpliceInRequest;

    /**
     * Encodes the specified SpliceInRequest message. Does not implicitly {@link api.SpliceInRequest.verify|verify} messages.
     * @param message SpliceInRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpliceInRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpliceInRequest message, length delimited. Does not implicitly {@link api.SpliceInRequest.verify|verify} messages.
     * @param message SpliceInRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpliceInRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpliceInRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpliceInRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpliceInRequest;

    /**
     * Decodes a SpliceInRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpliceInRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpliceInRequest;

    /**
     * Verifies a SpliceInRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpliceInRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpliceInRequest
     */
    public static fromObject(object: { [k: string]: any }): api.SpliceInRequest;

    /**
     * Creates a plain object from a SpliceInRequest message. Also converts values to other types if specified.
     * @param message SpliceInRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpliceInRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpliceInRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpliceInRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpliceInResponse. */
  interface ISpliceInResponse {}

  /** Represents a SpliceInResponse. */
  class SpliceInResponse implements ISpliceInResponse {
    /**
     * Constructs a new SpliceInResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpliceInResponse);

    /**
     * Creates a new SpliceInResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpliceInResponse instance
     */
    public static create(
      properties?: api.ISpliceInResponse
    ): api.SpliceInResponse;

    /**
     * Encodes the specified SpliceInResponse message. Does not implicitly {@link api.SpliceInResponse.verify|verify} messages.
     * @param message SpliceInResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpliceInResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpliceInResponse message, length delimited. Does not implicitly {@link api.SpliceInResponse.verify|verify} messages.
     * @param message SpliceInResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpliceInResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpliceInResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpliceInResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpliceInResponse;

    /**
     * Decodes a SpliceInResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpliceInResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpliceInResponse;

    /**
     * Verifies a SpliceInResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpliceInResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpliceInResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SpliceInResponse;

    /**
     * Creates a plain object from a SpliceInResponse message. Also converts values to other types if specified.
     * @param message SpliceInResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpliceInResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpliceInResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpliceInResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpliceOutRequest. */
  interface ISpliceOutRequest {
    /** SpliceOutRequest userChannelId */
    userChannelId?: string | null;

    /** SpliceOutRequest counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** SpliceOutRequest address */
    address?: string | null;

    /** SpliceOutRequest spliceAmountSats */
    spliceAmountSats?: number | Long | null;
  }

  /** Represents a SpliceOutRequest. */
  class SpliceOutRequest implements ISpliceOutRequest {
    /**
     * Constructs a new SpliceOutRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpliceOutRequest);

    /** SpliceOutRequest userChannelId. */
    public userChannelId: string;

    /** SpliceOutRequest counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** SpliceOutRequest address. */
    public address?: string | null;

    /** SpliceOutRequest spliceAmountSats. */
    public spliceAmountSats: number | Long;

    /**
     * Creates a new SpliceOutRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpliceOutRequest instance
     */
    public static create(
      properties?: api.ISpliceOutRequest
    ): api.SpliceOutRequest;

    /**
     * Encodes the specified SpliceOutRequest message. Does not implicitly {@link api.SpliceOutRequest.verify|verify} messages.
     * @param message SpliceOutRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpliceOutRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpliceOutRequest message, length delimited. Does not implicitly {@link api.SpliceOutRequest.verify|verify} messages.
     * @param message SpliceOutRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpliceOutRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpliceOutRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpliceOutRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpliceOutRequest;

    /**
     * Decodes a SpliceOutRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpliceOutRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpliceOutRequest;

    /**
     * Verifies a SpliceOutRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpliceOutRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpliceOutRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SpliceOutRequest;

    /**
     * Creates a plain object from a SpliceOutRequest message. Also converts values to other types if specified.
     * @param message SpliceOutRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpliceOutRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpliceOutRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpliceOutRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SpliceOutResponse. */
  interface ISpliceOutResponse {
    /** SpliceOutResponse address */
    address?: string | null;
  }

  /** Represents a SpliceOutResponse. */
  class SpliceOutResponse implements ISpliceOutResponse {
    /**
     * Constructs a new SpliceOutResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISpliceOutResponse);

    /** SpliceOutResponse address. */
    public address: string;

    /**
     * Creates a new SpliceOutResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SpliceOutResponse instance
     */
    public static create(
      properties?: api.ISpliceOutResponse
    ): api.SpliceOutResponse;

    /**
     * Encodes the specified SpliceOutResponse message. Does not implicitly {@link api.SpliceOutResponse.verify|verify} messages.
     * @param message SpliceOutResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISpliceOutResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SpliceOutResponse message, length delimited. Does not implicitly {@link api.SpliceOutResponse.verify|verify} messages.
     * @param message SpliceOutResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISpliceOutResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SpliceOutResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SpliceOutResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SpliceOutResponse;

    /**
     * Decodes a SpliceOutResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SpliceOutResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SpliceOutResponse;

    /**
     * Verifies a SpliceOutResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SpliceOutResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SpliceOutResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SpliceOutResponse;

    /**
     * Creates a plain object from a SpliceOutResponse message. Also converts values to other types if specified.
     * @param message SpliceOutResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SpliceOutResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SpliceOutResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SpliceOutResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an UpdateChannelConfigRequest. */
  interface IUpdateChannelConfigRequest {
    /** UpdateChannelConfigRequest userChannelId */
    userChannelId?: string | null;

    /** UpdateChannelConfigRequest counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** UpdateChannelConfigRequest channelConfig */
    channelConfig?: types.IChannelConfig | null;
  }

  /** Represents an UpdateChannelConfigRequest. */
  class UpdateChannelConfigRequest implements IUpdateChannelConfigRequest {
    /**
     * Constructs a new UpdateChannelConfigRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IUpdateChannelConfigRequest);

    /** UpdateChannelConfigRequest userChannelId. */
    public userChannelId: string;

    /** UpdateChannelConfigRequest counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** UpdateChannelConfigRequest channelConfig. */
    public channelConfig?: types.IChannelConfig | null;

    /**
     * Creates a new UpdateChannelConfigRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UpdateChannelConfigRequest instance
     */
    public static create(
      properties?: api.IUpdateChannelConfigRequest
    ): api.UpdateChannelConfigRequest;

    /**
     * Encodes the specified UpdateChannelConfigRequest message. Does not implicitly {@link api.UpdateChannelConfigRequest.verify|verify} messages.
     * @param message UpdateChannelConfigRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IUpdateChannelConfigRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified UpdateChannelConfigRequest message, length delimited. Does not implicitly {@link api.UpdateChannelConfigRequest.verify|verify} messages.
     * @param message UpdateChannelConfigRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IUpdateChannelConfigRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an UpdateChannelConfigRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UpdateChannelConfigRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.UpdateChannelConfigRequest;

    /**
     * Decodes an UpdateChannelConfigRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UpdateChannelConfigRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.UpdateChannelConfigRequest;

    /**
     * Verifies an UpdateChannelConfigRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an UpdateChannelConfigRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UpdateChannelConfigRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.UpdateChannelConfigRequest;

    /**
     * Creates a plain object from an UpdateChannelConfigRequest message. Also converts values to other types if specified.
     * @param message UpdateChannelConfigRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.UpdateChannelConfigRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this UpdateChannelConfigRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UpdateChannelConfigRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an UpdateChannelConfigResponse. */
  interface IUpdateChannelConfigResponse {}

  /** Represents an UpdateChannelConfigResponse. */
  class UpdateChannelConfigResponse implements IUpdateChannelConfigResponse {
    /**
     * Constructs a new UpdateChannelConfigResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IUpdateChannelConfigResponse);

    /**
     * Creates a new UpdateChannelConfigResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UpdateChannelConfigResponse instance
     */
    public static create(
      properties?: api.IUpdateChannelConfigResponse
    ): api.UpdateChannelConfigResponse;

    /**
     * Encodes the specified UpdateChannelConfigResponse message. Does not implicitly {@link api.UpdateChannelConfigResponse.verify|verify} messages.
     * @param message UpdateChannelConfigResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IUpdateChannelConfigResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified UpdateChannelConfigResponse message, length delimited. Does not implicitly {@link api.UpdateChannelConfigResponse.verify|verify} messages.
     * @param message UpdateChannelConfigResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IUpdateChannelConfigResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an UpdateChannelConfigResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UpdateChannelConfigResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.UpdateChannelConfigResponse;

    /**
     * Decodes an UpdateChannelConfigResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UpdateChannelConfigResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.UpdateChannelConfigResponse;

    /**
     * Verifies an UpdateChannelConfigResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an UpdateChannelConfigResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UpdateChannelConfigResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.UpdateChannelConfigResponse;

    /**
     * Creates a plain object from an UpdateChannelConfigResponse message. Also converts values to other types if specified.
     * @param message UpdateChannelConfigResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.UpdateChannelConfigResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this UpdateChannelConfigResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UpdateChannelConfigResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CloseChannelRequest. */
  interface ICloseChannelRequest {
    /** CloseChannelRequest userChannelId */
    userChannelId?: string | null;

    /** CloseChannelRequest counterpartyNodeId */
    counterpartyNodeId?: string | null;
  }

  /** Represents a CloseChannelRequest. */
  class CloseChannelRequest implements ICloseChannelRequest {
    /**
     * Constructs a new CloseChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ICloseChannelRequest);

    /** CloseChannelRequest userChannelId. */
    public userChannelId: string;

    /** CloseChannelRequest counterpartyNodeId. */
    public counterpartyNodeId: string;

    /**
     * Creates a new CloseChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CloseChannelRequest instance
     */
    public static create(
      properties?: api.ICloseChannelRequest
    ): api.CloseChannelRequest;

    /**
     * Encodes the specified CloseChannelRequest message. Does not implicitly {@link api.CloseChannelRequest.verify|verify} messages.
     * @param message CloseChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ICloseChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified CloseChannelRequest message, length delimited. Does not implicitly {@link api.CloseChannelRequest.verify|verify} messages.
     * @param message CloseChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ICloseChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a CloseChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CloseChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.CloseChannelRequest;

    /**
     * Decodes a CloseChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CloseChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.CloseChannelRequest;

    /**
     * Verifies a CloseChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CloseChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CloseChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.CloseChannelRequest;

    /**
     * Creates a plain object from a CloseChannelRequest message. Also converts values to other types if specified.
     * @param message CloseChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.CloseChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this CloseChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CloseChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CloseChannelResponse. */
  interface ICloseChannelResponse {}

  /** Represents a CloseChannelResponse. */
  class CloseChannelResponse implements ICloseChannelResponse {
    /**
     * Constructs a new CloseChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ICloseChannelResponse);

    /**
     * Creates a new CloseChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CloseChannelResponse instance
     */
    public static create(
      properties?: api.ICloseChannelResponse
    ): api.CloseChannelResponse;

    /**
     * Encodes the specified CloseChannelResponse message. Does not implicitly {@link api.CloseChannelResponse.verify|verify} messages.
     * @param message CloseChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ICloseChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified CloseChannelResponse message, length delimited. Does not implicitly {@link api.CloseChannelResponse.verify|verify} messages.
     * @param message CloseChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ICloseChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a CloseChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CloseChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.CloseChannelResponse;

    /**
     * Decodes a CloseChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CloseChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.CloseChannelResponse;

    /**
     * Verifies a CloseChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CloseChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CloseChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.CloseChannelResponse;

    /**
     * Creates a plain object from a CloseChannelResponse message. Also converts values to other types if specified.
     * @param message CloseChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.CloseChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this CloseChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CloseChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ForceCloseChannelRequest. */
  interface IForceCloseChannelRequest {
    /** ForceCloseChannelRequest userChannelId */
    userChannelId?: string | null;

    /** ForceCloseChannelRequest counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** ForceCloseChannelRequest forceCloseReason */
    forceCloseReason?: string | null;
  }

  /** Represents a ForceCloseChannelRequest. */
  class ForceCloseChannelRequest implements IForceCloseChannelRequest {
    /**
     * Constructs a new ForceCloseChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IForceCloseChannelRequest);

    /** ForceCloseChannelRequest userChannelId. */
    public userChannelId: string;

    /** ForceCloseChannelRequest counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** ForceCloseChannelRequest forceCloseReason. */
    public forceCloseReason?: string | null;

    /**
     * Creates a new ForceCloseChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ForceCloseChannelRequest instance
     */
    public static create(
      properties?: api.IForceCloseChannelRequest
    ): api.ForceCloseChannelRequest;

    /**
     * Encodes the specified ForceCloseChannelRequest message. Does not implicitly {@link api.ForceCloseChannelRequest.verify|verify} messages.
     * @param message ForceCloseChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IForceCloseChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ForceCloseChannelRequest message, length delimited. Does not implicitly {@link api.ForceCloseChannelRequest.verify|verify} messages.
     * @param message ForceCloseChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IForceCloseChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ForceCloseChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ForceCloseChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ForceCloseChannelRequest;

    /**
     * Decodes a ForceCloseChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ForceCloseChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ForceCloseChannelRequest;

    /**
     * Verifies a ForceCloseChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ForceCloseChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ForceCloseChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ForceCloseChannelRequest;

    /**
     * Creates a plain object from a ForceCloseChannelRequest message. Also converts values to other types if specified.
     * @param message ForceCloseChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ForceCloseChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ForceCloseChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ForceCloseChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ForceCloseChannelResponse. */
  interface IForceCloseChannelResponse {}

  /** Represents a ForceCloseChannelResponse. */
  class ForceCloseChannelResponse implements IForceCloseChannelResponse {
    /**
     * Constructs a new ForceCloseChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IForceCloseChannelResponse);

    /**
     * Creates a new ForceCloseChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ForceCloseChannelResponse instance
     */
    public static create(
      properties?: api.IForceCloseChannelResponse
    ): api.ForceCloseChannelResponse;

    /**
     * Encodes the specified ForceCloseChannelResponse message. Does not implicitly {@link api.ForceCloseChannelResponse.verify|verify} messages.
     * @param message ForceCloseChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IForceCloseChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ForceCloseChannelResponse message, length delimited. Does not implicitly {@link api.ForceCloseChannelResponse.verify|verify} messages.
     * @param message ForceCloseChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IForceCloseChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ForceCloseChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ForceCloseChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ForceCloseChannelResponse;

    /**
     * Decodes a ForceCloseChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ForceCloseChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ForceCloseChannelResponse;

    /**
     * Verifies a ForceCloseChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ForceCloseChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ForceCloseChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ForceCloseChannelResponse;

    /**
     * Creates a plain object from a ForceCloseChannelResponse message. Also converts values to other types if specified.
     * @param message ForceCloseChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ForceCloseChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ForceCloseChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ForceCloseChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListChannelsRequest. */
  interface IListChannelsRequest {}

  /** Represents a ListChannelsRequest. */
  class ListChannelsRequest implements IListChannelsRequest {
    /**
     * Constructs a new ListChannelsRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListChannelsRequest);

    /**
     * Creates a new ListChannelsRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListChannelsRequest instance
     */
    public static create(
      properties?: api.IListChannelsRequest
    ): api.ListChannelsRequest;

    /**
     * Encodes the specified ListChannelsRequest message. Does not implicitly {@link api.ListChannelsRequest.verify|verify} messages.
     * @param message ListChannelsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListChannelsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListChannelsRequest message, length delimited. Does not implicitly {@link api.ListChannelsRequest.verify|verify} messages.
     * @param message ListChannelsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListChannelsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListChannelsRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListChannelsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListChannelsRequest;

    /**
     * Decodes a ListChannelsRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListChannelsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListChannelsRequest;

    /**
     * Verifies a ListChannelsRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListChannelsRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListChannelsRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListChannelsRequest;

    /**
     * Creates a plain object from a ListChannelsRequest message. Also converts values to other types if specified.
     * @param message ListChannelsRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListChannelsRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListChannelsRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListChannelsRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListChannelsResponse. */
  interface IListChannelsResponse {
    /** ListChannelsResponse channels */
    channels?: types.IChannel[] | null;
  }

  /** Represents a ListChannelsResponse. */
  class ListChannelsResponse implements IListChannelsResponse {
    /**
     * Constructs a new ListChannelsResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListChannelsResponse);

    /** ListChannelsResponse channels. */
    public channels: types.IChannel[];

    /**
     * Creates a new ListChannelsResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListChannelsResponse instance
     */
    public static create(
      properties?: api.IListChannelsResponse
    ): api.ListChannelsResponse;

    /**
     * Encodes the specified ListChannelsResponse message. Does not implicitly {@link api.ListChannelsResponse.verify|verify} messages.
     * @param message ListChannelsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListChannelsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListChannelsResponse message, length delimited. Does not implicitly {@link api.ListChannelsResponse.verify|verify} messages.
     * @param message ListChannelsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListChannelsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListChannelsResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListChannelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListChannelsResponse;

    /**
     * Decodes a ListChannelsResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListChannelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListChannelsResponse;

    /**
     * Verifies a ListChannelsResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListChannelsResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListChannelsResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListChannelsResponse;

    /**
     * Creates a plain object from a ListChannelsResponse message. Also converts values to other types if specified.
     * @param message ListChannelsResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListChannelsResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListChannelsResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListChannelsResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GetPaymentDetailsRequest. */
  interface IGetPaymentDetailsRequest {
    /** GetPaymentDetailsRequest paymentId */
    paymentId?: string | null;
  }

  /** Represents a GetPaymentDetailsRequest. */
  class GetPaymentDetailsRequest implements IGetPaymentDetailsRequest {
    /**
     * Constructs a new GetPaymentDetailsRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetPaymentDetailsRequest);

    /** GetPaymentDetailsRequest paymentId. */
    public paymentId: string;

    /**
     * Creates a new GetPaymentDetailsRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetPaymentDetailsRequest instance
     */
    public static create(
      properties?: api.IGetPaymentDetailsRequest
    ): api.GetPaymentDetailsRequest;

    /**
     * Encodes the specified GetPaymentDetailsRequest message. Does not implicitly {@link api.GetPaymentDetailsRequest.verify|verify} messages.
     * @param message GetPaymentDetailsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetPaymentDetailsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetPaymentDetailsRequest message, length delimited. Does not implicitly {@link api.GetPaymentDetailsRequest.verify|verify} messages.
     * @param message GetPaymentDetailsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetPaymentDetailsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetPaymentDetailsRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetPaymentDetailsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetPaymentDetailsRequest;

    /**
     * Decodes a GetPaymentDetailsRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetPaymentDetailsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetPaymentDetailsRequest;

    /**
     * Verifies a GetPaymentDetailsRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetPaymentDetailsRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetPaymentDetailsRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetPaymentDetailsRequest;

    /**
     * Creates a plain object from a GetPaymentDetailsRequest message. Also converts values to other types if specified.
     * @param message GetPaymentDetailsRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetPaymentDetailsRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetPaymentDetailsRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetPaymentDetailsRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GetPaymentDetailsResponse. */
  interface IGetPaymentDetailsResponse {
    /** GetPaymentDetailsResponse payment */
    payment?: types.IPayment | null;
  }

  /** Represents a GetPaymentDetailsResponse. */
  class GetPaymentDetailsResponse implements IGetPaymentDetailsResponse {
    /**
     * Constructs a new GetPaymentDetailsResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetPaymentDetailsResponse);

    /** GetPaymentDetailsResponse payment. */
    public payment?: types.IPayment | null;

    /**
     * Creates a new GetPaymentDetailsResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetPaymentDetailsResponse instance
     */
    public static create(
      properties?: api.IGetPaymentDetailsResponse
    ): api.GetPaymentDetailsResponse;

    /**
     * Encodes the specified GetPaymentDetailsResponse message. Does not implicitly {@link api.GetPaymentDetailsResponse.verify|verify} messages.
     * @param message GetPaymentDetailsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetPaymentDetailsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetPaymentDetailsResponse message, length delimited. Does not implicitly {@link api.GetPaymentDetailsResponse.verify|verify} messages.
     * @param message GetPaymentDetailsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetPaymentDetailsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetPaymentDetailsResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetPaymentDetailsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetPaymentDetailsResponse;

    /**
     * Decodes a GetPaymentDetailsResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetPaymentDetailsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetPaymentDetailsResponse;

    /**
     * Verifies a GetPaymentDetailsResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetPaymentDetailsResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetPaymentDetailsResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetPaymentDetailsResponse;

    /**
     * Creates a plain object from a GetPaymentDetailsResponse message. Also converts values to other types if specified.
     * @param message GetPaymentDetailsResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetPaymentDetailsResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetPaymentDetailsResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetPaymentDetailsResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListPaymentsRequest. */
  interface IListPaymentsRequest {
    /** ListPaymentsRequest pageToken */
    pageToken?: types.IPageToken | null;
  }

  /** Represents a ListPaymentsRequest. */
  class ListPaymentsRequest implements IListPaymentsRequest {
    /**
     * Constructs a new ListPaymentsRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListPaymentsRequest);

    /** ListPaymentsRequest pageToken. */
    public pageToken?: types.IPageToken | null;

    /**
     * Creates a new ListPaymentsRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListPaymentsRequest instance
     */
    public static create(
      properties?: api.IListPaymentsRequest
    ): api.ListPaymentsRequest;

    /**
     * Encodes the specified ListPaymentsRequest message. Does not implicitly {@link api.ListPaymentsRequest.verify|verify} messages.
     * @param message ListPaymentsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListPaymentsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListPaymentsRequest message, length delimited. Does not implicitly {@link api.ListPaymentsRequest.verify|verify} messages.
     * @param message ListPaymentsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListPaymentsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListPaymentsRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListPaymentsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListPaymentsRequest;

    /**
     * Decodes a ListPaymentsRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListPaymentsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListPaymentsRequest;

    /**
     * Verifies a ListPaymentsRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListPaymentsRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListPaymentsRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListPaymentsRequest;

    /**
     * Creates a plain object from a ListPaymentsRequest message. Also converts values to other types if specified.
     * @param message ListPaymentsRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListPaymentsRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListPaymentsRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListPaymentsRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListPaymentsResponse. */
  interface IListPaymentsResponse {
    /** ListPaymentsResponse payments */
    payments?: types.IPayment[] | null;

    /** ListPaymentsResponse nextPageToken */
    nextPageToken?: types.IPageToken | null;
  }

  /** Represents a ListPaymentsResponse. */
  class ListPaymentsResponse implements IListPaymentsResponse {
    /**
     * Constructs a new ListPaymentsResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListPaymentsResponse);

    /** ListPaymentsResponse payments. */
    public payments: types.IPayment[];

    /** ListPaymentsResponse nextPageToken. */
    public nextPageToken?: types.IPageToken | null;

    /**
     * Creates a new ListPaymentsResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListPaymentsResponse instance
     */
    public static create(
      properties?: api.IListPaymentsResponse
    ): api.ListPaymentsResponse;

    /**
     * Encodes the specified ListPaymentsResponse message. Does not implicitly {@link api.ListPaymentsResponse.verify|verify} messages.
     * @param message ListPaymentsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListPaymentsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListPaymentsResponse message, length delimited. Does not implicitly {@link api.ListPaymentsResponse.verify|verify} messages.
     * @param message ListPaymentsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListPaymentsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListPaymentsResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListPaymentsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListPaymentsResponse;

    /**
     * Decodes a ListPaymentsResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListPaymentsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListPaymentsResponse;

    /**
     * Verifies a ListPaymentsResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListPaymentsResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListPaymentsResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListPaymentsResponse;

    /**
     * Creates a plain object from a ListPaymentsResponse message. Also converts values to other types if specified.
     * @param message ListPaymentsResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListPaymentsResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListPaymentsResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListPaymentsResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListForwardedPaymentsRequest. */
  interface IListForwardedPaymentsRequest {
    /** ListForwardedPaymentsRequest pageToken */
    pageToken?: types.IPageToken | null;
  }

  /** Represents a ListForwardedPaymentsRequest. */
  class ListForwardedPaymentsRequest implements IListForwardedPaymentsRequest {
    /**
     * Constructs a new ListForwardedPaymentsRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListForwardedPaymentsRequest);

    /** ListForwardedPaymentsRequest pageToken. */
    public pageToken?: types.IPageToken | null;

    /**
     * Creates a new ListForwardedPaymentsRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListForwardedPaymentsRequest instance
     */
    public static create(
      properties?: api.IListForwardedPaymentsRequest
    ): api.ListForwardedPaymentsRequest;

    /**
     * Encodes the specified ListForwardedPaymentsRequest message. Does not implicitly {@link api.ListForwardedPaymentsRequest.verify|verify} messages.
     * @param message ListForwardedPaymentsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListForwardedPaymentsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListForwardedPaymentsRequest message, length delimited. Does not implicitly {@link api.ListForwardedPaymentsRequest.verify|verify} messages.
     * @param message ListForwardedPaymentsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListForwardedPaymentsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListForwardedPaymentsRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListForwardedPaymentsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListForwardedPaymentsRequest;

    /**
     * Decodes a ListForwardedPaymentsRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListForwardedPaymentsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListForwardedPaymentsRequest;

    /**
     * Verifies a ListForwardedPaymentsRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListForwardedPaymentsRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListForwardedPaymentsRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListForwardedPaymentsRequest;

    /**
     * Creates a plain object from a ListForwardedPaymentsRequest message. Also converts values to other types if specified.
     * @param message ListForwardedPaymentsRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListForwardedPaymentsRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListForwardedPaymentsRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListForwardedPaymentsRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListForwardedPaymentsResponse. */
  interface IListForwardedPaymentsResponse {
    /** ListForwardedPaymentsResponse forwardedPayments */
    forwardedPayments?: types.IForwardedPayment[] | null;

    /** ListForwardedPaymentsResponse nextPageToken */
    nextPageToken?: types.IPageToken | null;
  }

  /** Represents a ListForwardedPaymentsResponse. */
  class ListForwardedPaymentsResponse implements IListForwardedPaymentsResponse {
    /**
     * Constructs a new ListForwardedPaymentsResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListForwardedPaymentsResponse);

    /** ListForwardedPaymentsResponse forwardedPayments. */
    public forwardedPayments: types.IForwardedPayment[];

    /** ListForwardedPaymentsResponse nextPageToken. */
    public nextPageToken?: types.IPageToken | null;

    /**
     * Creates a new ListForwardedPaymentsResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListForwardedPaymentsResponse instance
     */
    public static create(
      properties?: api.IListForwardedPaymentsResponse
    ): api.ListForwardedPaymentsResponse;

    /**
     * Encodes the specified ListForwardedPaymentsResponse message. Does not implicitly {@link api.ListForwardedPaymentsResponse.verify|verify} messages.
     * @param message ListForwardedPaymentsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListForwardedPaymentsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListForwardedPaymentsResponse message, length delimited. Does not implicitly {@link api.ListForwardedPaymentsResponse.verify|verify} messages.
     * @param message ListForwardedPaymentsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListForwardedPaymentsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListForwardedPaymentsResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListForwardedPaymentsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListForwardedPaymentsResponse;

    /**
     * Decodes a ListForwardedPaymentsResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListForwardedPaymentsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListForwardedPaymentsResponse;

    /**
     * Verifies a ListForwardedPaymentsResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListForwardedPaymentsResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListForwardedPaymentsResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListForwardedPaymentsResponse;

    /**
     * Creates a plain object from a ListForwardedPaymentsResponse message. Also converts values to other types if specified.
     * @param message ListForwardedPaymentsResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListForwardedPaymentsResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListForwardedPaymentsResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListForwardedPaymentsResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SignMessageRequest. */
  interface ISignMessageRequest {
    /** SignMessageRequest message */
    message?: Uint8Array | null;
  }

  /** Represents a SignMessageRequest. */
  class SignMessageRequest implements ISignMessageRequest {
    /**
     * Constructs a new SignMessageRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISignMessageRequest);

    /** SignMessageRequest message. */
    public message: Uint8Array;

    /**
     * Creates a new SignMessageRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SignMessageRequest instance
     */
    public static create(
      properties?: api.ISignMessageRequest
    ): api.SignMessageRequest;

    /**
     * Encodes the specified SignMessageRequest message. Does not implicitly {@link api.SignMessageRequest.verify|verify} messages.
     * @param message SignMessageRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISignMessageRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SignMessageRequest message, length delimited. Does not implicitly {@link api.SignMessageRequest.verify|verify} messages.
     * @param message SignMessageRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISignMessageRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SignMessageRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SignMessageRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SignMessageRequest;

    /**
     * Decodes a SignMessageRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SignMessageRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SignMessageRequest;

    /**
     * Verifies a SignMessageRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SignMessageRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SignMessageRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SignMessageRequest;

    /**
     * Creates a plain object from a SignMessageRequest message. Also converts values to other types if specified.
     * @param message SignMessageRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SignMessageRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SignMessageRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SignMessageRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SignMessageResponse. */
  interface ISignMessageResponse {
    /** SignMessageResponse signature */
    signature?: string | null;
  }

  /** Represents a SignMessageResponse. */
  class SignMessageResponse implements ISignMessageResponse {
    /**
     * Constructs a new SignMessageResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.ISignMessageResponse);

    /** SignMessageResponse signature. */
    public signature: string;

    /**
     * Creates a new SignMessageResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SignMessageResponse instance
     */
    public static create(
      properties?: api.ISignMessageResponse
    ): api.SignMessageResponse;

    /**
     * Encodes the specified SignMessageResponse message. Does not implicitly {@link api.SignMessageResponse.verify|verify} messages.
     * @param message SignMessageResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.ISignMessageResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified SignMessageResponse message, length delimited. Does not implicitly {@link api.SignMessageResponse.verify|verify} messages.
     * @param message SignMessageResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.ISignMessageResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a SignMessageResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SignMessageResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.SignMessageResponse;

    /**
     * Decodes a SignMessageResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SignMessageResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.SignMessageResponse;

    /**
     * Verifies a SignMessageResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SignMessageResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SignMessageResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.SignMessageResponse;

    /**
     * Creates a plain object from a SignMessageResponse message. Also converts values to other types if specified.
     * @param message SignMessageResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.SignMessageResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this SignMessageResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SignMessageResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a VerifySignatureRequest. */
  interface IVerifySignatureRequest {
    /** VerifySignatureRequest message */
    message?: Uint8Array | null;

    /** VerifySignatureRequest signature */
    signature?: string | null;

    /** VerifySignatureRequest publicKey */
    publicKey?: string | null;
  }

  /** Represents a VerifySignatureRequest. */
  class VerifySignatureRequest implements IVerifySignatureRequest {
    /**
     * Constructs a new VerifySignatureRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IVerifySignatureRequest);

    /** VerifySignatureRequest message. */
    public message: Uint8Array;

    /** VerifySignatureRequest signature. */
    public signature: string;

    /** VerifySignatureRequest publicKey. */
    public publicKey: string;

    /**
     * Creates a new VerifySignatureRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VerifySignatureRequest instance
     */
    public static create(
      properties?: api.IVerifySignatureRequest
    ): api.VerifySignatureRequest;

    /**
     * Encodes the specified VerifySignatureRequest message. Does not implicitly {@link api.VerifySignatureRequest.verify|verify} messages.
     * @param message VerifySignatureRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IVerifySignatureRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified VerifySignatureRequest message, length delimited. Does not implicitly {@link api.VerifySignatureRequest.verify|verify} messages.
     * @param message VerifySignatureRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IVerifySignatureRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a VerifySignatureRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VerifySignatureRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.VerifySignatureRequest;

    /**
     * Decodes a VerifySignatureRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VerifySignatureRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.VerifySignatureRequest;

    /**
     * Verifies a VerifySignatureRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a VerifySignatureRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VerifySignatureRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.VerifySignatureRequest;

    /**
     * Creates a plain object from a VerifySignatureRequest message. Also converts values to other types if specified.
     * @param message VerifySignatureRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.VerifySignatureRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this VerifySignatureRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for VerifySignatureRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a VerifySignatureResponse. */
  interface IVerifySignatureResponse {
    /** VerifySignatureResponse valid */
    valid?: boolean | null;
  }

  /** Represents a VerifySignatureResponse. */
  class VerifySignatureResponse implements IVerifySignatureResponse {
    /**
     * Constructs a new VerifySignatureResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IVerifySignatureResponse);

    /** VerifySignatureResponse valid. */
    public valid: boolean;

    /**
     * Creates a new VerifySignatureResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VerifySignatureResponse instance
     */
    public static create(
      properties?: api.IVerifySignatureResponse
    ): api.VerifySignatureResponse;

    /**
     * Encodes the specified VerifySignatureResponse message. Does not implicitly {@link api.VerifySignatureResponse.verify|verify} messages.
     * @param message VerifySignatureResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IVerifySignatureResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified VerifySignatureResponse message, length delimited. Does not implicitly {@link api.VerifySignatureResponse.verify|verify} messages.
     * @param message VerifySignatureResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IVerifySignatureResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a VerifySignatureResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VerifySignatureResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.VerifySignatureResponse;

    /**
     * Decodes a VerifySignatureResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VerifySignatureResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.VerifySignatureResponse;

    /**
     * Verifies a VerifySignatureResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a VerifySignatureResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VerifySignatureResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.VerifySignatureResponse;

    /**
     * Creates a plain object from a VerifySignatureResponse message. Also converts values to other types if specified.
     * @param message VerifySignatureResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.VerifySignatureResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this VerifySignatureResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for VerifySignatureResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ExportPathfindingScoresRequest. */
  interface IExportPathfindingScoresRequest {}

  /** Represents an ExportPathfindingScoresRequest. */
  class ExportPathfindingScoresRequest implements IExportPathfindingScoresRequest {
    /**
     * Constructs a new ExportPathfindingScoresRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IExportPathfindingScoresRequest);

    /**
     * Creates a new ExportPathfindingScoresRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ExportPathfindingScoresRequest instance
     */
    public static create(
      properties?: api.IExportPathfindingScoresRequest
    ): api.ExportPathfindingScoresRequest;

    /**
     * Encodes the specified ExportPathfindingScoresRequest message. Does not implicitly {@link api.ExportPathfindingScoresRequest.verify|verify} messages.
     * @param message ExportPathfindingScoresRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IExportPathfindingScoresRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ExportPathfindingScoresRequest message, length delimited. Does not implicitly {@link api.ExportPathfindingScoresRequest.verify|verify} messages.
     * @param message ExportPathfindingScoresRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IExportPathfindingScoresRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an ExportPathfindingScoresRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ExportPathfindingScoresRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ExportPathfindingScoresRequest;

    /**
     * Decodes an ExportPathfindingScoresRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ExportPathfindingScoresRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ExportPathfindingScoresRequest;

    /**
     * Verifies an ExportPathfindingScoresRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ExportPathfindingScoresRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ExportPathfindingScoresRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ExportPathfindingScoresRequest;

    /**
     * Creates a plain object from an ExportPathfindingScoresRequest message. Also converts values to other types if specified.
     * @param message ExportPathfindingScoresRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ExportPathfindingScoresRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ExportPathfindingScoresRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ExportPathfindingScoresRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ExportPathfindingScoresResponse. */
  interface IExportPathfindingScoresResponse {
    /** ExportPathfindingScoresResponse scores */
    scores?: Uint8Array | null;
  }

  /** Represents an ExportPathfindingScoresResponse. */
  class ExportPathfindingScoresResponse implements IExportPathfindingScoresResponse {
    /**
     * Constructs a new ExportPathfindingScoresResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IExportPathfindingScoresResponse);

    /** ExportPathfindingScoresResponse scores. */
    public scores: Uint8Array;

    /**
     * Creates a new ExportPathfindingScoresResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ExportPathfindingScoresResponse instance
     */
    public static create(
      properties?: api.IExportPathfindingScoresResponse
    ): api.ExportPathfindingScoresResponse;

    /**
     * Encodes the specified ExportPathfindingScoresResponse message. Does not implicitly {@link api.ExportPathfindingScoresResponse.verify|verify} messages.
     * @param message ExportPathfindingScoresResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IExportPathfindingScoresResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ExportPathfindingScoresResponse message, length delimited. Does not implicitly {@link api.ExportPathfindingScoresResponse.verify|verify} messages.
     * @param message ExportPathfindingScoresResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IExportPathfindingScoresResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an ExportPathfindingScoresResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ExportPathfindingScoresResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ExportPathfindingScoresResponse;

    /**
     * Decodes an ExportPathfindingScoresResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ExportPathfindingScoresResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ExportPathfindingScoresResponse;

    /**
     * Verifies an ExportPathfindingScoresResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ExportPathfindingScoresResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ExportPathfindingScoresResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ExportPathfindingScoresResponse;

    /**
     * Creates a plain object from an ExportPathfindingScoresResponse message. Also converts values to other types if specified.
     * @param message ExportPathfindingScoresResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ExportPathfindingScoresResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ExportPathfindingScoresResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ExportPathfindingScoresResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GetBalancesRequest. */
  interface IGetBalancesRequest {}

  /** Represents a GetBalancesRequest. */
  class GetBalancesRequest implements IGetBalancesRequest {
    /**
     * Constructs a new GetBalancesRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetBalancesRequest);

    /**
     * Creates a new GetBalancesRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetBalancesRequest instance
     */
    public static create(
      properties?: api.IGetBalancesRequest
    ): api.GetBalancesRequest;

    /**
     * Encodes the specified GetBalancesRequest message. Does not implicitly {@link api.GetBalancesRequest.verify|verify} messages.
     * @param message GetBalancesRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetBalancesRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetBalancesRequest message, length delimited. Does not implicitly {@link api.GetBalancesRequest.verify|verify} messages.
     * @param message GetBalancesRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetBalancesRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetBalancesRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetBalancesRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetBalancesRequest;

    /**
     * Decodes a GetBalancesRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetBalancesRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetBalancesRequest;

    /**
     * Verifies a GetBalancesRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetBalancesRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetBalancesRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetBalancesRequest;

    /**
     * Creates a plain object from a GetBalancesRequest message. Also converts values to other types if specified.
     * @param message GetBalancesRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetBalancesRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetBalancesRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetBalancesRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GetBalancesResponse. */
  interface IGetBalancesResponse {
    /** GetBalancesResponse totalOnchainBalanceSats */
    totalOnchainBalanceSats?: number | Long | null;

    /** GetBalancesResponse spendableOnchainBalanceSats */
    spendableOnchainBalanceSats?: number | Long | null;

    /** GetBalancesResponse totalAnchorChannelsReserveSats */
    totalAnchorChannelsReserveSats?: number | Long | null;

    /** GetBalancesResponse totalLightningBalanceSats */
    totalLightningBalanceSats?: number | Long | null;

    /** GetBalancesResponse lightningBalances */
    lightningBalances?: types.ILightningBalance[] | null;

    /** GetBalancesResponse pendingBalancesFromChannelClosures */
    pendingBalancesFromChannelClosures?: types.IPendingSweepBalance[] | null;
  }

  /** Represents a GetBalancesResponse. */
  class GetBalancesResponse implements IGetBalancesResponse {
    /**
     * Constructs a new GetBalancesResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGetBalancesResponse);

    /** GetBalancesResponse totalOnchainBalanceSats. */
    public totalOnchainBalanceSats: number | Long;

    /** GetBalancesResponse spendableOnchainBalanceSats. */
    public spendableOnchainBalanceSats: number | Long;

    /** GetBalancesResponse totalAnchorChannelsReserveSats. */
    public totalAnchorChannelsReserveSats: number | Long;

    /** GetBalancesResponse totalLightningBalanceSats. */
    public totalLightningBalanceSats: number | Long;

    /** GetBalancesResponse lightningBalances. */
    public lightningBalances: types.ILightningBalance[];

    /** GetBalancesResponse pendingBalancesFromChannelClosures. */
    public pendingBalancesFromChannelClosures: types.IPendingSweepBalance[];

    /**
     * Creates a new GetBalancesResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GetBalancesResponse instance
     */
    public static create(
      properties?: api.IGetBalancesResponse
    ): api.GetBalancesResponse;

    /**
     * Encodes the specified GetBalancesResponse message. Does not implicitly {@link api.GetBalancesResponse.verify|verify} messages.
     * @param message GetBalancesResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGetBalancesResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GetBalancesResponse message, length delimited. Does not implicitly {@link api.GetBalancesResponse.verify|verify} messages.
     * @param message GetBalancesResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGetBalancesResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GetBalancesResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GetBalancesResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GetBalancesResponse;

    /**
     * Decodes a GetBalancesResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GetBalancesResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GetBalancesResponse;

    /**
     * Verifies a GetBalancesResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GetBalancesResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GetBalancesResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GetBalancesResponse;

    /**
     * Creates a plain object from a GetBalancesResponse message. Also converts values to other types if specified.
     * @param message GetBalancesResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GetBalancesResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GetBalancesResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GetBalancesResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ConnectPeerRequest. */
  interface IConnectPeerRequest {
    /** ConnectPeerRequest nodePubkey */
    nodePubkey?: string | null;

    /** ConnectPeerRequest address */
    address?: string | null;

    /** ConnectPeerRequest persist */
    persist?: boolean | null;
  }

  /** Represents a ConnectPeerRequest. */
  class ConnectPeerRequest implements IConnectPeerRequest {
    /**
     * Constructs a new ConnectPeerRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IConnectPeerRequest);

    /** ConnectPeerRequest nodePubkey. */
    public nodePubkey: string;

    /** ConnectPeerRequest address. */
    public address: string;

    /** ConnectPeerRequest persist. */
    public persist: boolean;

    /**
     * Creates a new ConnectPeerRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ConnectPeerRequest instance
     */
    public static create(
      properties?: api.IConnectPeerRequest
    ): api.ConnectPeerRequest;

    /**
     * Encodes the specified ConnectPeerRequest message. Does not implicitly {@link api.ConnectPeerRequest.verify|verify} messages.
     * @param message ConnectPeerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IConnectPeerRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ConnectPeerRequest message, length delimited. Does not implicitly {@link api.ConnectPeerRequest.verify|verify} messages.
     * @param message ConnectPeerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IConnectPeerRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ConnectPeerRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ConnectPeerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ConnectPeerRequest;

    /**
     * Decodes a ConnectPeerRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ConnectPeerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ConnectPeerRequest;

    /**
     * Verifies a ConnectPeerRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ConnectPeerRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ConnectPeerRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ConnectPeerRequest;

    /**
     * Creates a plain object from a ConnectPeerRequest message. Also converts values to other types if specified.
     * @param message ConnectPeerRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ConnectPeerRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ConnectPeerRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ConnectPeerRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ConnectPeerResponse. */
  interface IConnectPeerResponse {}

  /** Represents a ConnectPeerResponse. */
  class ConnectPeerResponse implements IConnectPeerResponse {
    /**
     * Constructs a new ConnectPeerResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IConnectPeerResponse);

    /**
     * Creates a new ConnectPeerResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ConnectPeerResponse instance
     */
    public static create(
      properties?: api.IConnectPeerResponse
    ): api.ConnectPeerResponse;

    /**
     * Encodes the specified ConnectPeerResponse message. Does not implicitly {@link api.ConnectPeerResponse.verify|verify} messages.
     * @param message ConnectPeerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IConnectPeerResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ConnectPeerResponse message, length delimited. Does not implicitly {@link api.ConnectPeerResponse.verify|verify} messages.
     * @param message ConnectPeerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IConnectPeerResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ConnectPeerResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ConnectPeerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ConnectPeerResponse;

    /**
     * Decodes a ConnectPeerResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ConnectPeerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ConnectPeerResponse;

    /**
     * Verifies a ConnectPeerResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ConnectPeerResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ConnectPeerResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ConnectPeerResponse;

    /**
     * Creates a plain object from a ConnectPeerResponse message. Also converts values to other types if specified.
     * @param message ConnectPeerResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ConnectPeerResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ConnectPeerResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ConnectPeerResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DisconnectPeerRequest. */
  interface IDisconnectPeerRequest {
    /** DisconnectPeerRequest nodePubkey */
    nodePubkey?: string | null;
  }

  /** Represents a DisconnectPeerRequest. */
  class DisconnectPeerRequest implements IDisconnectPeerRequest {
    /**
     * Constructs a new DisconnectPeerRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDisconnectPeerRequest);

    /** DisconnectPeerRequest nodePubkey. */
    public nodePubkey: string;

    /**
     * Creates a new DisconnectPeerRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DisconnectPeerRequest instance
     */
    public static create(
      properties?: api.IDisconnectPeerRequest
    ): api.DisconnectPeerRequest;

    /**
     * Encodes the specified DisconnectPeerRequest message. Does not implicitly {@link api.DisconnectPeerRequest.verify|verify} messages.
     * @param message DisconnectPeerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDisconnectPeerRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DisconnectPeerRequest message, length delimited. Does not implicitly {@link api.DisconnectPeerRequest.verify|verify} messages.
     * @param message DisconnectPeerRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDisconnectPeerRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DisconnectPeerRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DisconnectPeerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DisconnectPeerRequest;

    /**
     * Decodes a DisconnectPeerRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DisconnectPeerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DisconnectPeerRequest;

    /**
     * Verifies a DisconnectPeerRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DisconnectPeerRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DisconnectPeerRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DisconnectPeerRequest;

    /**
     * Creates a plain object from a DisconnectPeerRequest message. Also converts values to other types if specified.
     * @param message DisconnectPeerRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DisconnectPeerRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DisconnectPeerRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DisconnectPeerRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DisconnectPeerResponse. */
  interface IDisconnectPeerResponse {}

  /** Represents a DisconnectPeerResponse. */
  class DisconnectPeerResponse implements IDisconnectPeerResponse {
    /**
     * Constructs a new DisconnectPeerResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDisconnectPeerResponse);

    /**
     * Creates a new DisconnectPeerResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DisconnectPeerResponse instance
     */
    public static create(
      properties?: api.IDisconnectPeerResponse
    ): api.DisconnectPeerResponse;

    /**
     * Encodes the specified DisconnectPeerResponse message. Does not implicitly {@link api.DisconnectPeerResponse.verify|verify} messages.
     * @param message DisconnectPeerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDisconnectPeerResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DisconnectPeerResponse message, length delimited. Does not implicitly {@link api.DisconnectPeerResponse.verify|verify} messages.
     * @param message DisconnectPeerResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDisconnectPeerResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DisconnectPeerResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DisconnectPeerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DisconnectPeerResponse;

    /**
     * Decodes a DisconnectPeerResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DisconnectPeerResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DisconnectPeerResponse;

    /**
     * Verifies a DisconnectPeerResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DisconnectPeerResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DisconnectPeerResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DisconnectPeerResponse;

    /**
     * Creates a plain object from a DisconnectPeerResponse message. Also converts values to other types if specified.
     * @param message DisconnectPeerResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DisconnectPeerResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DisconnectPeerResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DisconnectPeerResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListPeersRequest. */
  interface IListPeersRequest {}

  /** Represents a ListPeersRequest. */
  class ListPeersRequest implements IListPeersRequest {
    /**
     * Constructs a new ListPeersRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListPeersRequest);

    /**
     * Creates a new ListPeersRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListPeersRequest instance
     */
    public static create(
      properties?: api.IListPeersRequest
    ): api.ListPeersRequest;

    /**
     * Encodes the specified ListPeersRequest message. Does not implicitly {@link api.ListPeersRequest.verify|verify} messages.
     * @param message ListPeersRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListPeersRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListPeersRequest message, length delimited. Does not implicitly {@link api.ListPeersRequest.verify|verify} messages.
     * @param message ListPeersRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListPeersRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListPeersRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListPeersRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListPeersRequest;

    /**
     * Decodes a ListPeersRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListPeersRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListPeersRequest;

    /**
     * Verifies a ListPeersRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListPeersRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListPeersRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListPeersRequest;

    /**
     * Creates a plain object from a ListPeersRequest message. Also converts values to other types if specified.
     * @param message ListPeersRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListPeersRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListPeersRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListPeersRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ListPeersResponse. */
  interface IListPeersResponse {
    /** ListPeersResponse peers */
    peers?: types.IPeer[] | null;
  }

  /** Represents a ListPeersResponse. */
  class ListPeersResponse implements IListPeersResponse {
    /**
     * Constructs a new ListPeersResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IListPeersResponse);

    /** ListPeersResponse peers. */
    public peers: types.IPeer[];

    /**
     * Creates a new ListPeersResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ListPeersResponse instance
     */
    public static create(
      properties?: api.IListPeersResponse
    ): api.ListPeersResponse;

    /**
     * Encodes the specified ListPeersResponse message. Does not implicitly {@link api.ListPeersResponse.verify|verify} messages.
     * @param message ListPeersResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IListPeersResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ListPeersResponse message, length delimited. Does not implicitly {@link api.ListPeersResponse.verify|verify} messages.
     * @param message ListPeersResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IListPeersResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ListPeersResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ListPeersResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.ListPeersResponse;

    /**
     * Decodes a ListPeersResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ListPeersResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.ListPeersResponse;

    /**
     * Verifies a ListPeersResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ListPeersResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ListPeersResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.ListPeersResponse;

    /**
     * Creates a plain object from a ListPeersResponse message. Also converts values to other types if specified.
     * @param message ListPeersResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.ListPeersResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ListPeersResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ListPeersResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphListChannelsRequest. */
  interface IGraphListChannelsRequest {}

  /** Represents a GraphListChannelsRequest. */
  class GraphListChannelsRequest implements IGraphListChannelsRequest {
    /**
     * Constructs a new GraphListChannelsRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphListChannelsRequest);

    /**
     * Creates a new GraphListChannelsRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphListChannelsRequest instance
     */
    public static create(
      properties?: api.IGraphListChannelsRequest
    ): api.GraphListChannelsRequest;

    /**
     * Encodes the specified GraphListChannelsRequest message. Does not implicitly {@link api.GraphListChannelsRequest.verify|verify} messages.
     * @param message GraphListChannelsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphListChannelsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphListChannelsRequest message, length delimited. Does not implicitly {@link api.GraphListChannelsRequest.verify|verify} messages.
     * @param message GraphListChannelsRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphListChannelsRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphListChannelsRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphListChannelsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphListChannelsRequest;

    /**
     * Decodes a GraphListChannelsRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphListChannelsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphListChannelsRequest;

    /**
     * Verifies a GraphListChannelsRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphListChannelsRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphListChannelsRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphListChannelsRequest;

    /**
     * Creates a plain object from a GraphListChannelsRequest message. Also converts values to other types if specified.
     * @param message GraphListChannelsRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphListChannelsRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphListChannelsRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphListChannelsRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphListChannelsResponse. */
  interface IGraphListChannelsResponse {
    /** GraphListChannelsResponse shortChannelIds */
    shortChannelIds?: (number | Long)[] | null;
  }

  /** Represents a GraphListChannelsResponse. */
  class GraphListChannelsResponse implements IGraphListChannelsResponse {
    /**
     * Constructs a new GraphListChannelsResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphListChannelsResponse);

    /** GraphListChannelsResponse shortChannelIds. */
    public shortChannelIds: (number | Long)[];

    /**
     * Creates a new GraphListChannelsResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphListChannelsResponse instance
     */
    public static create(
      properties?: api.IGraphListChannelsResponse
    ): api.GraphListChannelsResponse;

    /**
     * Encodes the specified GraphListChannelsResponse message. Does not implicitly {@link api.GraphListChannelsResponse.verify|verify} messages.
     * @param message GraphListChannelsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphListChannelsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphListChannelsResponse message, length delimited. Does not implicitly {@link api.GraphListChannelsResponse.verify|verify} messages.
     * @param message GraphListChannelsResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphListChannelsResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphListChannelsResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphListChannelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphListChannelsResponse;

    /**
     * Decodes a GraphListChannelsResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphListChannelsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphListChannelsResponse;

    /**
     * Verifies a GraphListChannelsResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphListChannelsResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphListChannelsResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphListChannelsResponse;

    /**
     * Creates a plain object from a GraphListChannelsResponse message. Also converts values to other types if specified.
     * @param message GraphListChannelsResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphListChannelsResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphListChannelsResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphListChannelsResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphGetChannelRequest. */
  interface IGraphGetChannelRequest {
    /** GraphGetChannelRequest shortChannelId */
    shortChannelId?: number | Long | null;
  }

  /** Represents a GraphGetChannelRequest. */
  class GraphGetChannelRequest implements IGraphGetChannelRequest {
    /**
     * Constructs a new GraphGetChannelRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphGetChannelRequest);

    /** GraphGetChannelRequest shortChannelId. */
    public shortChannelId: number | Long;

    /**
     * Creates a new GraphGetChannelRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphGetChannelRequest instance
     */
    public static create(
      properties?: api.IGraphGetChannelRequest
    ): api.GraphGetChannelRequest;

    /**
     * Encodes the specified GraphGetChannelRequest message. Does not implicitly {@link api.GraphGetChannelRequest.verify|verify} messages.
     * @param message GraphGetChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphGetChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphGetChannelRequest message, length delimited. Does not implicitly {@link api.GraphGetChannelRequest.verify|verify} messages.
     * @param message GraphGetChannelRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphGetChannelRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphGetChannelRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphGetChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphGetChannelRequest;

    /**
     * Decodes a GraphGetChannelRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphGetChannelRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphGetChannelRequest;

    /**
     * Verifies a GraphGetChannelRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphGetChannelRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphGetChannelRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphGetChannelRequest;

    /**
     * Creates a plain object from a GraphGetChannelRequest message. Also converts values to other types if specified.
     * @param message GraphGetChannelRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphGetChannelRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphGetChannelRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphGetChannelRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphGetChannelResponse. */
  interface IGraphGetChannelResponse {
    /** GraphGetChannelResponse channel */
    channel?: types.IGraphChannel | null;
  }

  /** Represents a GraphGetChannelResponse. */
  class GraphGetChannelResponse implements IGraphGetChannelResponse {
    /**
     * Constructs a new GraphGetChannelResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphGetChannelResponse);

    /** GraphGetChannelResponse channel. */
    public channel?: types.IGraphChannel | null;

    /**
     * Creates a new GraphGetChannelResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphGetChannelResponse instance
     */
    public static create(
      properties?: api.IGraphGetChannelResponse
    ): api.GraphGetChannelResponse;

    /**
     * Encodes the specified GraphGetChannelResponse message. Does not implicitly {@link api.GraphGetChannelResponse.verify|verify} messages.
     * @param message GraphGetChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphGetChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphGetChannelResponse message, length delimited. Does not implicitly {@link api.GraphGetChannelResponse.verify|verify} messages.
     * @param message GraphGetChannelResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphGetChannelResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphGetChannelResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphGetChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphGetChannelResponse;

    /**
     * Decodes a GraphGetChannelResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphGetChannelResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphGetChannelResponse;

    /**
     * Verifies a GraphGetChannelResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphGetChannelResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphGetChannelResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphGetChannelResponse;

    /**
     * Creates a plain object from a GraphGetChannelResponse message. Also converts values to other types if specified.
     * @param message GraphGetChannelResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphGetChannelResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphGetChannelResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphGetChannelResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphListNodesRequest. */
  interface IGraphListNodesRequest {}

  /** Represents a GraphListNodesRequest. */
  class GraphListNodesRequest implements IGraphListNodesRequest {
    /**
     * Constructs a new GraphListNodesRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphListNodesRequest);

    /**
     * Creates a new GraphListNodesRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphListNodesRequest instance
     */
    public static create(
      properties?: api.IGraphListNodesRequest
    ): api.GraphListNodesRequest;

    /**
     * Encodes the specified GraphListNodesRequest message. Does not implicitly {@link api.GraphListNodesRequest.verify|verify} messages.
     * @param message GraphListNodesRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphListNodesRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphListNodesRequest message, length delimited. Does not implicitly {@link api.GraphListNodesRequest.verify|verify} messages.
     * @param message GraphListNodesRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphListNodesRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphListNodesRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphListNodesRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphListNodesRequest;

    /**
     * Decodes a GraphListNodesRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphListNodesRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphListNodesRequest;

    /**
     * Verifies a GraphListNodesRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphListNodesRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphListNodesRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphListNodesRequest;

    /**
     * Creates a plain object from a GraphListNodesRequest message. Also converts values to other types if specified.
     * @param message GraphListNodesRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphListNodesRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphListNodesRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphListNodesRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphListNodesResponse. */
  interface IGraphListNodesResponse {
    /** GraphListNodesResponse nodeIds */
    nodeIds?: string[] | null;
  }

  /** Represents a GraphListNodesResponse. */
  class GraphListNodesResponse implements IGraphListNodesResponse {
    /**
     * Constructs a new GraphListNodesResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphListNodesResponse);

    /** GraphListNodesResponse nodeIds. */
    public nodeIds: string[];

    /**
     * Creates a new GraphListNodesResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphListNodesResponse instance
     */
    public static create(
      properties?: api.IGraphListNodesResponse
    ): api.GraphListNodesResponse;

    /**
     * Encodes the specified GraphListNodesResponse message. Does not implicitly {@link api.GraphListNodesResponse.verify|verify} messages.
     * @param message GraphListNodesResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphListNodesResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphListNodesResponse message, length delimited. Does not implicitly {@link api.GraphListNodesResponse.verify|verify} messages.
     * @param message GraphListNodesResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphListNodesResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphListNodesResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphListNodesResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphListNodesResponse;

    /**
     * Decodes a GraphListNodesResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphListNodesResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphListNodesResponse;

    /**
     * Verifies a GraphListNodesResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphListNodesResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphListNodesResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphListNodesResponse;

    /**
     * Creates a plain object from a GraphListNodesResponse message. Also converts values to other types if specified.
     * @param message GraphListNodesResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphListNodesResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphListNodesResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphListNodesResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an UnifiedSendRequest. */
  interface IUnifiedSendRequest {
    /** UnifiedSendRequest uri */
    uri?: string | null;

    /** UnifiedSendRequest amountMsat */
    amountMsat?: number | Long | null;

    /** UnifiedSendRequest routeParameters */
    routeParameters?: types.IRouteParametersConfig | null;
  }

  /** Represents an UnifiedSendRequest. */
  class UnifiedSendRequest implements IUnifiedSendRequest {
    /**
     * Constructs a new UnifiedSendRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IUnifiedSendRequest);

    /** UnifiedSendRequest uri. */
    public uri: string;

    /** UnifiedSendRequest amountMsat. */
    public amountMsat?: number | Long | null;

    /** UnifiedSendRequest routeParameters. */
    public routeParameters?: types.IRouteParametersConfig | null;

    /**
     * Creates a new UnifiedSendRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UnifiedSendRequest instance
     */
    public static create(
      properties?: api.IUnifiedSendRequest
    ): api.UnifiedSendRequest;

    /**
     * Encodes the specified UnifiedSendRequest message. Does not implicitly {@link api.UnifiedSendRequest.verify|verify} messages.
     * @param message UnifiedSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IUnifiedSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified UnifiedSendRequest message, length delimited. Does not implicitly {@link api.UnifiedSendRequest.verify|verify} messages.
     * @param message UnifiedSendRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IUnifiedSendRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an UnifiedSendRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UnifiedSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.UnifiedSendRequest;

    /**
     * Decodes an UnifiedSendRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UnifiedSendRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.UnifiedSendRequest;

    /**
     * Verifies an UnifiedSendRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an UnifiedSendRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UnifiedSendRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.UnifiedSendRequest;

    /**
     * Creates a plain object from an UnifiedSendRequest message. Also converts values to other types if specified.
     * @param message UnifiedSendRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.UnifiedSendRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this UnifiedSendRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UnifiedSendRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an UnifiedSendResponse. */
  interface IUnifiedSendResponse {
    /** UnifiedSendResponse txid */
    txid?: string | null;

    /** UnifiedSendResponse bolt11PaymentId */
    bolt11PaymentId?: string | null;

    /** UnifiedSendResponse bolt12PaymentId */
    bolt12PaymentId?: string | null;
  }

  /** Represents an UnifiedSendResponse. */
  class UnifiedSendResponse implements IUnifiedSendResponse {
    /**
     * Constructs a new UnifiedSendResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IUnifiedSendResponse);

    /** UnifiedSendResponse txid. */
    public txid?: string | null;

    /** UnifiedSendResponse bolt11PaymentId. */
    public bolt11PaymentId?: string | null;

    /** UnifiedSendResponse bolt12PaymentId. */
    public bolt12PaymentId?: string | null;

    /** UnifiedSendResponse paymentResult. */
    public paymentResult?: 'txid' | 'bolt11PaymentId' | 'bolt12PaymentId';

    /**
     * Creates a new UnifiedSendResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UnifiedSendResponse instance
     */
    public static create(
      properties?: api.IUnifiedSendResponse
    ): api.UnifiedSendResponse;

    /**
     * Encodes the specified UnifiedSendResponse message. Does not implicitly {@link api.UnifiedSendResponse.verify|verify} messages.
     * @param message UnifiedSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IUnifiedSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified UnifiedSendResponse message, length delimited. Does not implicitly {@link api.UnifiedSendResponse.verify|verify} messages.
     * @param message UnifiedSendResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IUnifiedSendResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an UnifiedSendResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UnifiedSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.UnifiedSendResponse;

    /**
     * Decodes an UnifiedSendResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UnifiedSendResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.UnifiedSendResponse;

    /**
     * Verifies an UnifiedSendResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an UnifiedSendResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UnifiedSendResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.UnifiedSendResponse;

    /**
     * Creates a plain object from an UnifiedSendResponse message. Also converts values to other types if specified.
     * @param message UnifiedSendResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.UnifiedSendResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this UnifiedSendResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UnifiedSendResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphGetNodeRequest. */
  interface IGraphGetNodeRequest {
    /** GraphGetNodeRequest nodeId */
    nodeId?: string | null;
  }

  /** Represents a GraphGetNodeRequest. */
  class GraphGetNodeRequest implements IGraphGetNodeRequest {
    /**
     * Constructs a new GraphGetNodeRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphGetNodeRequest);

    /** GraphGetNodeRequest nodeId. */
    public nodeId: string;

    /**
     * Creates a new GraphGetNodeRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphGetNodeRequest instance
     */
    public static create(
      properties?: api.IGraphGetNodeRequest
    ): api.GraphGetNodeRequest;

    /**
     * Encodes the specified GraphGetNodeRequest message. Does not implicitly {@link api.GraphGetNodeRequest.verify|verify} messages.
     * @param message GraphGetNodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphGetNodeRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphGetNodeRequest message, length delimited. Does not implicitly {@link api.GraphGetNodeRequest.verify|verify} messages.
     * @param message GraphGetNodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphGetNodeRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphGetNodeRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphGetNodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphGetNodeRequest;

    /**
     * Decodes a GraphGetNodeRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphGetNodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphGetNodeRequest;

    /**
     * Verifies a GraphGetNodeRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphGetNodeRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphGetNodeRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphGetNodeRequest;

    /**
     * Creates a plain object from a GraphGetNodeRequest message. Also converts values to other types if specified.
     * @param message GraphGetNodeRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphGetNodeRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphGetNodeRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphGetNodeRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphGetNodeResponse. */
  interface IGraphGetNodeResponse {
    /** GraphGetNodeResponse node */
    node?: types.IGraphNode | null;
  }

  /** Represents a GraphGetNodeResponse. */
  class GraphGetNodeResponse implements IGraphGetNodeResponse {
    /**
     * Constructs a new GraphGetNodeResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IGraphGetNodeResponse);

    /** GraphGetNodeResponse node. */
    public node?: types.IGraphNode | null;

    /**
     * Creates a new GraphGetNodeResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphGetNodeResponse instance
     */
    public static create(
      properties?: api.IGraphGetNodeResponse
    ): api.GraphGetNodeResponse;

    /**
     * Encodes the specified GraphGetNodeResponse message. Does not implicitly {@link api.GraphGetNodeResponse.verify|verify} messages.
     * @param message GraphGetNodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IGraphGetNodeResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphGetNodeResponse message, length delimited. Does not implicitly {@link api.GraphGetNodeResponse.verify|verify} messages.
     * @param message GraphGetNodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IGraphGetNodeResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphGetNodeResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphGetNodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.GraphGetNodeResponse;

    /**
     * Decodes a GraphGetNodeResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphGetNodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.GraphGetNodeResponse;

    /**
     * Verifies a GraphGetNodeResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphGetNodeResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphGetNodeResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.GraphGetNodeResponse;

    /**
     * Creates a plain object from a GraphGetNodeResponse message. Also converts values to other types if specified.
     * @param message GraphGetNodeResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.GraphGetNodeResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphGetNodeResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphGetNodeResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DecodeInvoiceRequest. */
  interface IDecodeInvoiceRequest {
    /** DecodeInvoiceRequest invoice */
    invoice?: string | null;
  }

  /** Represents a DecodeInvoiceRequest. */
  class DecodeInvoiceRequest implements IDecodeInvoiceRequest {
    /**
     * Constructs a new DecodeInvoiceRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDecodeInvoiceRequest);

    /** DecodeInvoiceRequest invoice. */
    public invoice: string;

    /**
     * Creates a new DecodeInvoiceRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeInvoiceRequest instance
     */
    public static create(
      properties?: api.IDecodeInvoiceRequest
    ): api.DecodeInvoiceRequest;

    /**
     * Encodes the specified DecodeInvoiceRequest message. Does not implicitly {@link api.DecodeInvoiceRequest.verify|verify} messages.
     * @param message DecodeInvoiceRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDecodeInvoiceRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeInvoiceRequest message, length delimited. Does not implicitly {@link api.DecodeInvoiceRequest.verify|verify} messages.
     * @param message DecodeInvoiceRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDecodeInvoiceRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeInvoiceRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeInvoiceRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DecodeInvoiceRequest;

    /**
     * Decodes a DecodeInvoiceRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeInvoiceRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DecodeInvoiceRequest;

    /**
     * Verifies a DecodeInvoiceRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DecodeInvoiceRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeInvoiceRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DecodeInvoiceRequest;

    /**
     * Creates a plain object from a DecodeInvoiceRequest message. Also converts values to other types if specified.
     * @param message DecodeInvoiceRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DecodeInvoiceRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DecodeInvoiceRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DecodeInvoiceRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DecodeInvoiceResponse. */
  interface IDecodeInvoiceResponse {
    /** DecodeInvoiceResponse destination */
    destination?: string | null;

    /** DecodeInvoiceResponse paymentHash */
    paymentHash?: string | null;

    /** DecodeInvoiceResponse amountMsat */
    amountMsat?: number | Long | null;

    /** DecodeInvoiceResponse timestamp */
    timestamp?: number | Long | null;

    /** DecodeInvoiceResponse expiry */
    expiry?: number | Long | null;

    /** DecodeInvoiceResponse description */
    description?: string | null;

    /** DecodeInvoiceResponse descriptionHash */
    descriptionHash?: string | null;

    /** DecodeInvoiceResponse fallbackAddress */
    fallbackAddress?: string | null;

    /** DecodeInvoiceResponse minFinalCltvExpiryDelta */
    minFinalCltvExpiryDelta?: number | Long | null;

    /** DecodeInvoiceResponse paymentSecret */
    paymentSecret?: string | null;

    /** DecodeInvoiceResponse routeHints */
    routeHints?: types.IBolt11RouteHint[] | null;

    /** DecodeInvoiceResponse features */
    features?: { [k: string]: types.IBolt11Feature } | null;

    /** DecodeInvoiceResponse currency */
    currency?: string | null;

    /** DecodeInvoiceResponse paymentMetadata */
    paymentMetadata?: string | null;
  }

  /** Represents a DecodeInvoiceResponse. */
  class DecodeInvoiceResponse implements IDecodeInvoiceResponse {
    /**
     * Constructs a new DecodeInvoiceResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDecodeInvoiceResponse);

    /** DecodeInvoiceResponse destination. */
    public destination: string;

    /** DecodeInvoiceResponse paymentHash. */
    public paymentHash: string;

    /** DecodeInvoiceResponse amountMsat. */
    public amountMsat?: number | Long | null;

    /** DecodeInvoiceResponse timestamp. */
    public timestamp: number | Long;

    /** DecodeInvoiceResponse expiry. */
    public expiry: number | Long;

    /** DecodeInvoiceResponse description. */
    public description?: string | null;

    /** DecodeInvoiceResponse descriptionHash. */
    public descriptionHash?: string | null;

    /** DecodeInvoiceResponse fallbackAddress. */
    public fallbackAddress?: string | null;

    /** DecodeInvoiceResponse minFinalCltvExpiryDelta. */
    public minFinalCltvExpiryDelta: number | Long;

    /** DecodeInvoiceResponse paymentSecret. */
    public paymentSecret: string;

    /** DecodeInvoiceResponse routeHints. */
    public routeHints: types.IBolt11RouteHint[];

    /** DecodeInvoiceResponse features. */
    public features: { [k: string]: types.IBolt11Feature };

    /** DecodeInvoiceResponse currency. */
    public currency: string;

    /** DecodeInvoiceResponse paymentMetadata. */
    public paymentMetadata?: string | null;

    /**
     * Creates a new DecodeInvoiceResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeInvoiceResponse instance
     */
    public static create(
      properties?: api.IDecodeInvoiceResponse
    ): api.DecodeInvoiceResponse;

    /**
     * Encodes the specified DecodeInvoiceResponse message. Does not implicitly {@link api.DecodeInvoiceResponse.verify|verify} messages.
     * @param message DecodeInvoiceResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDecodeInvoiceResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeInvoiceResponse message, length delimited. Does not implicitly {@link api.DecodeInvoiceResponse.verify|verify} messages.
     * @param message DecodeInvoiceResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDecodeInvoiceResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeInvoiceResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeInvoiceResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DecodeInvoiceResponse;

    /**
     * Decodes a DecodeInvoiceResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeInvoiceResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DecodeInvoiceResponse;

    /**
     * Verifies a DecodeInvoiceResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DecodeInvoiceResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeInvoiceResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DecodeInvoiceResponse;

    /**
     * Creates a plain object from a DecodeInvoiceResponse message. Also converts values to other types if specified.
     * @param message DecodeInvoiceResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DecodeInvoiceResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DecodeInvoiceResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DecodeInvoiceResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DecodeOfferRequest. */
  interface IDecodeOfferRequest {
    /** DecodeOfferRequest offer */
    offer?: string | null;
  }

  /** Represents a DecodeOfferRequest. */
  class DecodeOfferRequest implements IDecodeOfferRequest {
    /**
     * Constructs a new DecodeOfferRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDecodeOfferRequest);

    /** DecodeOfferRequest offer. */
    public offer: string;

    /**
     * Creates a new DecodeOfferRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeOfferRequest instance
     */
    public static create(
      properties?: api.IDecodeOfferRequest
    ): api.DecodeOfferRequest;

    /**
     * Encodes the specified DecodeOfferRequest message. Does not implicitly {@link api.DecodeOfferRequest.verify|verify} messages.
     * @param message DecodeOfferRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDecodeOfferRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeOfferRequest message, length delimited. Does not implicitly {@link api.DecodeOfferRequest.verify|verify} messages.
     * @param message DecodeOfferRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDecodeOfferRequest,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeOfferRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeOfferRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DecodeOfferRequest;

    /**
     * Decodes a DecodeOfferRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeOfferRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DecodeOfferRequest;

    /**
     * Verifies a DecodeOfferRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DecodeOfferRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeOfferRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DecodeOfferRequest;

    /**
     * Creates a plain object from a DecodeOfferRequest message. Also converts values to other types if specified.
     * @param message DecodeOfferRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DecodeOfferRequest,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DecodeOfferRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DecodeOfferRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DecodeOfferResponse. */
  interface IDecodeOfferResponse {
    /** DecodeOfferResponse offerId */
    offerId?: string | null;

    /** DecodeOfferResponse description */
    description?: string | null;

    /** DecodeOfferResponse issuer */
    issuer?: string | null;

    /** DecodeOfferResponse amount */
    amount?: types.IOfferAmount | null;

    /** DecodeOfferResponse issuerSigningPubkey */
    issuerSigningPubkey?: string | null;

    /** DecodeOfferResponse absoluteExpiry */
    absoluteExpiry?: number | Long | null;

    /** DecodeOfferResponse quantity */
    quantity?: types.IOfferQuantity | null;

    /** DecodeOfferResponse paths */
    paths?: types.IBlindedPath[] | null;

    /** DecodeOfferResponse features */
    features?: { [k: string]: types.IBolt11Feature } | null;

    /** DecodeOfferResponse chains */
    chains?: string[] | null;

    /** DecodeOfferResponse metadata */
    metadata?: string | null;

    /** DecodeOfferResponse isExpired */
    isExpired?: boolean | null;
  }

  /** Represents a DecodeOfferResponse. */
  class DecodeOfferResponse implements IDecodeOfferResponse {
    /**
     * Constructs a new DecodeOfferResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: api.IDecodeOfferResponse);

    /** DecodeOfferResponse offerId. */
    public offerId: string;

    /** DecodeOfferResponse description. */
    public description?: string | null;

    /** DecodeOfferResponse issuer. */
    public issuer?: string | null;

    /** DecodeOfferResponse amount. */
    public amount?: types.IOfferAmount | null;

    /** DecodeOfferResponse issuerSigningPubkey. */
    public issuerSigningPubkey?: string | null;

    /** DecodeOfferResponse absoluteExpiry. */
    public absoluteExpiry?: number | Long | null;

    /** DecodeOfferResponse quantity. */
    public quantity?: types.IOfferQuantity | null;

    /** DecodeOfferResponse paths. */
    public paths: types.IBlindedPath[];

    /** DecodeOfferResponse features. */
    public features: { [k: string]: types.IBolt11Feature };

    /** DecodeOfferResponse chains. */
    public chains: string[];

    /** DecodeOfferResponse metadata. */
    public metadata?: string | null;

    /** DecodeOfferResponse isExpired. */
    public isExpired: boolean;

    /**
     * Creates a new DecodeOfferResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeOfferResponse instance
     */
    public static create(
      properties?: api.IDecodeOfferResponse
    ): api.DecodeOfferResponse;

    /**
     * Encodes the specified DecodeOfferResponse message. Does not implicitly {@link api.DecodeOfferResponse.verify|verify} messages.
     * @param message DecodeOfferResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: api.IDecodeOfferResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeOfferResponse message, length delimited. Does not implicitly {@link api.DecodeOfferResponse.verify|verify} messages.
     * @param message DecodeOfferResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: api.IDecodeOfferResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeOfferResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeOfferResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): api.DecodeOfferResponse;

    /**
     * Decodes a DecodeOfferResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeOfferResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): api.DecodeOfferResponse;

    /**
     * Verifies a DecodeOfferResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DecodeOfferResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeOfferResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): api.DecodeOfferResponse;

    /**
     * Creates a plain object from a DecodeOfferResponse message. Also converts values to other types if specified.
     * @param message DecodeOfferResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: api.DecodeOfferResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this DecodeOfferResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DecodeOfferResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace types. */
export namespace types {
  /** Properties of a Payment. */
  interface IPayment {
    /** Payment id */
    id?: string | null;

    /** Payment kind */
    kind?: types.IPaymentKind | null;

    /** Payment amountMsat */
    amountMsat?: number | Long | null;

    /** Payment feePaidMsat */
    feePaidMsat?: number | Long | null;

    /** Payment direction */
    direction?: types.PaymentDirection | null;

    /** Payment status */
    status?: types.PaymentStatus | null;

    /** Payment latestUpdateTimestamp */
    latestUpdateTimestamp?: number | Long | null;
  }

  /** Represents a Payment. */
  class Payment implements IPayment {
    /**
     * Constructs a new Payment.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPayment);

    /** Payment id. */
    public id: string;

    /** Payment kind. */
    public kind?: types.IPaymentKind | null;

    /** Payment amountMsat. */
    public amountMsat?: number | Long | null;

    /** Payment feePaidMsat. */
    public feePaidMsat?: number | Long | null;

    /** Payment direction. */
    public direction: types.PaymentDirection;

    /** Payment status. */
    public status: types.PaymentStatus;

    /** Payment latestUpdateTimestamp. */
    public latestUpdateTimestamp: number | Long;

    /**
     * Creates a new Payment instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Payment instance
     */
    public static create(properties?: types.IPayment): types.Payment;

    /**
     * Encodes the specified Payment message. Does not implicitly {@link types.Payment.verify|verify} messages.
     * @param message Payment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPayment,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Payment message, length delimited. Does not implicitly {@link types.Payment.verify|verify} messages.
     * @param message Payment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPayment,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Payment message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Payment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Payment;

    /**
     * Decodes a Payment message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Payment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Payment;

    /**
     * Verifies a Payment message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Payment message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Payment
     */
    public static fromObject(object: { [k: string]: any }): types.Payment;

    /**
     * Creates a plain object from a Payment message. Also converts values to other types if specified.
     * @param message Payment
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Payment,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Payment to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Payment
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentKind. */
  interface IPaymentKind {
    /** PaymentKind onchain */
    onchain?: types.IOnchain | null;

    /** PaymentKind bolt11 */
    bolt11?: types.IBolt11 | null;

    /** PaymentKind bolt11Jit */
    bolt11Jit?: types.IBolt11Jit | null;

    /** PaymentKind bolt12Offer */
    bolt12Offer?: types.IBolt12Offer | null;

    /** PaymentKind bolt12Refund */
    bolt12Refund?: types.IBolt12Refund | null;

    /** PaymentKind spontaneous */
    spontaneous?: types.ISpontaneous | null;
  }

  /** Represents a PaymentKind. */
  class PaymentKind implements IPaymentKind {
    /**
     * Constructs a new PaymentKind.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPaymentKind);

    /** PaymentKind onchain. */
    public onchain?: types.IOnchain | null;

    /** PaymentKind bolt11. */
    public bolt11?: types.IBolt11 | null;

    /** PaymentKind bolt11Jit. */
    public bolt11Jit?: types.IBolt11Jit | null;

    /** PaymentKind bolt12Offer. */
    public bolt12Offer?: types.IBolt12Offer | null;

    /** PaymentKind bolt12Refund. */
    public bolt12Refund?: types.IBolt12Refund | null;

    /** PaymentKind spontaneous. */
    public spontaneous?: types.ISpontaneous | null;

    /** PaymentKind kind. */
    public kind?:
      | 'onchain'
      | 'bolt11'
      | 'bolt11Jit'
      | 'bolt12Offer'
      | 'bolt12Refund'
      | 'spontaneous';

    /**
     * Creates a new PaymentKind instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentKind instance
     */
    public static create(properties?: types.IPaymentKind): types.PaymentKind;

    /**
     * Encodes the specified PaymentKind message. Does not implicitly {@link types.PaymentKind.verify|verify} messages.
     * @param message PaymentKind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPaymentKind,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentKind message, length delimited. Does not implicitly {@link types.PaymentKind.verify|verify} messages.
     * @param message PaymentKind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPaymentKind,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentKind message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentKind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.PaymentKind;

    /**
     * Decodes a PaymentKind message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentKind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.PaymentKind;

    /**
     * Verifies a PaymentKind message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentKind message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentKind
     */
    public static fromObject(object: { [k: string]: any }): types.PaymentKind;

    /**
     * Creates a plain object from a PaymentKind message. Also converts values to other types if specified.
     * @param message PaymentKind
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.PaymentKind,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentKind to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentKind
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Onchain. */
  interface IOnchain {
    /** Onchain txid */
    txid?: string | null;

    /** Onchain status */
    status?: types.IConfirmationStatus | null;
  }

  /** Represents an Onchain. */
  class Onchain implements IOnchain {
    /**
     * Constructs a new Onchain.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IOnchain);

    /** Onchain txid. */
    public txid: string;

    /** Onchain status. */
    public status?: types.IConfirmationStatus | null;

    /**
     * Creates a new Onchain instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Onchain instance
     */
    public static create(properties?: types.IOnchain): types.Onchain;

    /**
     * Encodes the specified Onchain message. Does not implicitly {@link types.Onchain.verify|verify} messages.
     * @param message Onchain message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IOnchain,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Onchain message, length delimited. Does not implicitly {@link types.Onchain.verify|verify} messages.
     * @param message Onchain message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IOnchain,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an Onchain message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Onchain
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Onchain;

    /**
     * Decodes an Onchain message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Onchain
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Onchain;

    /**
     * Verifies an Onchain message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Onchain message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Onchain
     */
    public static fromObject(object: { [k: string]: any }): types.Onchain;

    /**
     * Creates a plain object from an Onchain message. Also converts values to other types if specified.
     * @param message Onchain
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Onchain,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Onchain to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Onchain
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ConfirmationStatus. */
  interface IConfirmationStatus {
    /** ConfirmationStatus confirmed */
    confirmed?: types.IConfirmed | null;

    /** ConfirmationStatus unconfirmed */
    unconfirmed?: types.IUnconfirmed | null;
  }

  /** Represents a ConfirmationStatus. */
  class ConfirmationStatus implements IConfirmationStatus {
    /**
     * Constructs a new ConfirmationStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IConfirmationStatus);

    /** ConfirmationStatus confirmed. */
    public confirmed?: types.IConfirmed | null;

    /** ConfirmationStatus unconfirmed. */
    public unconfirmed?: types.IUnconfirmed | null;

    /** ConfirmationStatus status. */
    public status?: 'confirmed' | 'unconfirmed';

    /**
     * Creates a new ConfirmationStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ConfirmationStatus instance
     */
    public static create(
      properties?: types.IConfirmationStatus
    ): types.ConfirmationStatus;

    /**
     * Encodes the specified ConfirmationStatus message. Does not implicitly {@link types.ConfirmationStatus.verify|verify} messages.
     * @param message ConfirmationStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IConfirmationStatus,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ConfirmationStatus message, length delimited. Does not implicitly {@link types.ConfirmationStatus.verify|verify} messages.
     * @param message ConfirmationStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IConfirmationStatus,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ConfirmationStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ConfirmationStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ConfirmationStatus;

    /**
     * Decodes a ConfirmationStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ConfirmationStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ConfirmationStatus;

    /**
     * Verifies a ConfirmationStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ConfirmationStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ConfirmationStatus
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.ConfirmationStatus;

    /**
     * Creates a plain object from a ConfirmationStatus message. Also converts values to other types if specified.
     * @param message ConfirmationStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ConfirmationStatus,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ConfirmationStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ConfirmationStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Confirmed. */
  interface IConfirmed {
    /** Confirmed blockHash */
    blockHash?: string | null;

    /** Confirmed height */
    height?: number | null;

    /** Confirmed timestamp */
    timestamp?: number | Long | null;
  }

  /** Represents a Confirmed. */
  class Confirmed implements IConfirmed {
    /**
     * Constructs a new Confirmed.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IConfirmed);

    /** Confirmed blockHash. */
    public blockHash: string;

    /** Confirmed height. */
    public height: number;

    /** Confirmed timestamp. */
    public timestamp: number | Long;

    /**
     * Creates a new Confirmed instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Confirmed instance
     */
    public static create(properties?: types.IConfirmed): types.Confirmed;

    /**
     * Encodes the specified Confirmed message. Does not implicitly {@link types.Confirmed.verify|verify} messages.
     * @param message Confirmed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IConfirmed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Confirmed message, length delimited. Does not implicitly {@link types.Confirmed.verify|verify} messages.
     * @param message Confirmed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IConfirmed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Confirmed message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Confirmed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Confirmed;

    /**
     * Decodes a Confirmed message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Confirmed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Confirmed;

    /**
     * Verifies a Confirmed message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Confirmed message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Confirmed
     */
    public static fromObject(object: { [k: string]: any }): types.Confirmed;

    /**
     * Creates a plain object from a Confirmed message. Also converts values to other types if specified.
     * @param message Confirmed
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Confirmed,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Confirmed to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Confirmed
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Unconfirmed. */
  interface IUnconfirmed {}

  /** Represents an Unconfirmed. */
  class Unconfirmed implements IUnconfirmed {
    /**
     * Constructs a new Unconfirmed.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IUnconfirmed);

    /**
     * Creates a new Unconfirmed instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Unconfirmed instance
     */
    public static create(properties?: types.IUnconfirmed): types.Unconfirmed;

    /**
     * Encodes the specified Unconfirmed message. Does not implicitly {@link types.Unconfirmed.verify|verify} messages.
     * @param message Unconfirmed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IUnconfirmed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Unconfirmed message, length delimited. Does not implicitly {@link types.Unconfirmed.verify|verify} messages.
     * @param message Unconfirmed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IUnconfirmed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an Unconfirmed message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Unconfirmed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Unconfirmed;

    /**
     * Decodes an Unconfirmed message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Unconfirmed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Unconfirmed;

    /**
     * Verifies an Unconfirmed message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Unconfirmed message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Unconfirmed
     */
    public static fromObject(object: { [k: string]: any }): types.Unconfirmed;

    /**
     * Creates a plain object from an Unconfirmed message. Also converts values to other types if specified.
     * @param message Unconfirmed
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Unconfirmed,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Unconfirmed to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Unconfirmed
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11. */
  interface IBolt11 {
    /** Bolt11 hash */
    hash?: string | null;

    /** Bolt11 preimage */
    preimage?: string | null;

    /** Bolt11 secret */
    secret?: Uint8Array | null;
  }

  /** Represents a Bolt11. */
  class Bolt11 implements IBolt11 {
    /**
     * Constructs a new Bolt11.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11);

    /** Bolt11 hash. */
    public hash: string;

    /** Bolt11 preimage. */
    public preimage?: string | null;

    /** Bolt11 secret. */
    public secret?: Uint8Array | null;

    /**
     * Creates a new Bolt11 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11 instance
     */
    public static create(properties?: types.IBolt11): types.Bolt11;

    /**
     * Encodes the specified Bolt11 message. Does not implicitly {@link types.Bolt11.verify|verify} messages.
     * @param message Bolt11 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11 message, length delimited. Does not implicitly {@link types.Bolt11.verify|verify} messages.
     * @param message Bolt11 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11;

    /**
     * Decodes a Bolt11 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11;

    /**
     * Verifies a Bolt11 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt11;

    /**
     * Creates a plain object from a Bolt11 message. Also converts values to other types if specified.
     * @param message Bolt11
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11Jit. */
  interface IBolt11Jit {
    /** Bolt11Jit hash */
    hash?: string | null;

    /** Bolt11Jit preimage */
    preimage?: string | null;

    /** Bolt11Jit secret */
    secret?: Uint8Array | null;

    /** Bolt11Jit lspFeeLimits */
    lspFeeLimits?: types.ILSPFeeLimits | null;

    /** Bolt11Jit counterpartySkimmedFeeMsat */
    counterpartySkimmedFeeMsat?: number | Long | null;
  }

  /** Represents a Bolt11Jit. */
  class Bolt11Jit implements IBolt11Jit {
    /**
     * Constructs a new Bolt11Jit.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11Jit);

    /** Bolt11Jit hash. */
    public hash: string;

    /** Bolt11Jit preimage. */
    public preimage?: string | null;

    /** Bolt11Jit secret. */
    public secret?: Uint8Array | null;

    /** Bolt11Jit lspFeeLimits. */
    public lspFeeLimits?: types.ILSPFeeLimits | null;

    /** Bolt11Jit counterpartySkimmedFeeMsat. */
    public counterpartySkimmedFeeMsat?: number | Long | null;

    /**
     * Creates a new Bolt11Jit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11Jit instance
     */
    public static create(properties?: types.IBolt11Jit): types.Bolt11Jit;

    /**
     * Encodes the specified Bolt11Jit message. Does not implicitly {@link types.Bolt11Jit.verify|verify} messages.
     * @param message Bolt11Jit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11Jit,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11Jit message, length delimited. Does not implicitly {@link types.Bolt11Jit.verify|verify} messages.
     * @param message Bolt11Jit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11Jit,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11Jit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11Jit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11Jit;

    /**
     * Decodes a Bolt11Jit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11Jit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11Jit;

    /**
     * Verifies a Bolt11Jit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11Jit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11Jit
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt11Jit;

    /**
     * Creates a plain object from a Bolt11Jit message. Also converts values to other types if specified.
     * @param message Bolt11Jit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11Jit,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11Jit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11Jit
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12Offer. */
  interface IBolt12Offer {
    /** Bolt12Offer hash */
    hash?: string | null;

    /** Bolt12Offer preimage */
    preimage?: string | null;

    /** Bolt12Offer secret */
    secret?: Uint8Array | null;

    /** Bolt12Offer offerId */
    offerId?: string | null;

    /** Bolt12Offer payerNote */
    payerNote?: string | null;

    /** Bolt12Offer quantity */
    quantity?: number | Long | null;
  }

  /** Represents a Bolt12Offer. */
  class Bolt12Offer implements IBolt12Offer {
    /**
     * Constructs a new Bolt12Offer.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt12Offer);

    /** Bolt12Offer hash. */
    public hash?: string | null;

    /** Bolt12Offer preimage. */
    public preimage?: string | null;

    /** Bolt12Offer secret. */
    public secret?: Uint8Array | null;

    /** Bolt12Offer offerId. */
    public offerId: string;

    /** Bolt12Offer payerNote. */
    public payerNote?: string | null;

    /** Bolt12Offer quantity. */
    public quantity?: number | Long | null;

    /**
     * Creates a new Bolt12Offer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12Offer instance
     */
    public static create(properties?: types.IBolt12Offer): types.Bolt12Offer;

    /**
     * Encodes the specified Bolt12Offer message. Does not implicitly {@link types.Bolt12Offer.verify|verify} messages.
     * @param message Bolt12Offer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt12Offer,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12Offer message, length delimited. Does not implicitly {@link types.Bolt12Offer.verify|verify} messages.
     * @param message Bolt12Offer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt12Offer,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12Offer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12Offer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt12Offer;

    /**
     * Decodes a Bolt12Offer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12Offer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt12Offer;

    /**
     * Verifies a Bolt12Offer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12Offer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12Offer
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt12Offer;

    /**
     * Creates a plain object from a Bolt12Offer message. Also converts values to other types if specified.
     * @param message Bolt12Offer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt12Offer,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12Offer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12Offer
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt12Refund. */
  interface IBolt12Refund {
    /** Bolt12Refund hash */
    hash?: string | null;

    /** Bolt12Refund preimage */
    preimage?: string | null;

    /** Bolt12Refund secret */
    secret?: Uint8Array | null;

    /** Bolt12Refund payerNote */
    payerNote?: string | null;

    /** Bolt12Refund quantity */
    quantity?: number | Long | null;
  }

  /** Represents a Bolt12Refund. */
  class Bolt12Refund implements IBolt12Refund {
    /**
     * Constructs a new Bolt12Refund.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt12Refund);

    /** Bolt12Refund hash. */
    public hash?: string | null;

    /** Bolt12Refund preimage. */
    public preimage?: string | null;

    /** Bolt12Refund secret. */
    public secret?: Uint8Array | null;

    /** Bolt12Refund payerNote. */
    public payerNote?: string | null;

    /** Bolt12Refund quantity. */
    public quantity?: number | Long | null;

    /**
     * Creates a new Bolt12Refund instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt12Refund instance
     */
    public static create(properties?: types.IBolt12Refund): types.Bolt12Refund;

    /**
     * Encodes the specified Bolt12Refund message. Does not implicitly {@link types.Bolt12Refund.verify|verify} messages.
     * @param message Bolt12Refund message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt12Refund,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt12Refund message, length delimited. Does not implicitly {@link types.Bolt12Refund.verify|verify} messages.
     * @param message Bolt12Refund message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt12Refund,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt12Refund message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt12Refund
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt12Refund;

    /**
     * Decodes a Bolt12Refund message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt12Refund
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt12Refund;

    /**
     * Verifies a Bolt12Refund message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt12Refund message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt12Refund
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt12Refund;

    /**
     * Creates a plain object from a Bolt12Refund message. Also converts values to other types if specified.
     * @param message Bolt12Refund
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt12Refund,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt12Refund to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt12Refund
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Spontaneous. */
  interface ISpontaneous {
    /** Spontaneous hash */
    hash?: string | null;

    /** Spontaneous preimage */
    preimage?: string | null;
  }

  /** Represents a Spontaneous. */
  class Spontaneous implements ISpontaneous {
    /**
     * Constructs a new Spontaneous.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.ISpontaneous);

    /** Spontaneous hash. */
    public hash: string;

    /** Spontaneous preimage. */
    public preimage?: string | null;

    /**
     * Creates a new Spontaneous instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Spontaneous instance
     */
    public static create(properties?: types.ISpontaneous): types.Spontaneous;

    /**
     * Encodes the specified Spontaneous message. Does not implicitly {@link types.Spontaneous.verify|verify} messages.
     * @param message Spontaneous message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.ISpontaneous,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Spontaneous message, length delimited. Does not implicitly {@link types.Spontaneous.verify|verify} messages.
     * @param message Spontaneous message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.ISpontaneous,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Spontaneous message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Spontaneous
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Spontaneous;

    /**
     * Decodes a Spontaneous message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Spontaneous
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Spontaneous;

    /**
     * Verifies a Spontaneous message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Spontaneous message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Spontaneous
     */
    public static fromObject(object: { [k: string]: any }): types.Spontaneous;

    /**
     * Creates a plain object from a Spontaneous message. Also converts values to other types if specified.
     * @param message Spontaneous
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Spontaneous,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Spontaneous to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Spontaneous
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a LSPFeeLimits. */
  interface ILSPFeeLimits {
    /** LSPFeeLimits maxTotalOpeningFeeMsat */
    maxTotalOpeningFeeMsat?: number | Long | null;

    /** LSPFeeLimits maxProportionalOpeningFeePpmMsat */
    maxProportionalOpeningFeePpmMsat?: number | Long | null;
  }

  /** Represents a LSPFeeLimits. */
  class LSPFeeLimits implements ILSPFeeLimits {
    /**
     * Constructs a new LSPFeeLimits.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.ILSPFeeLimits);

    /** LSPFeeLimits maxTotalOpeningFeeMsat. */
    public maxTotalOpeningFeeMsat?: number | Long | null;

    /** LSPFeeLimits maxProportionalOpeningFeePpmMsat. */
    public maxProportionalOpeningFeePpmMsat?: number | Long | null;

    /**
     * Creates a new LSPFeeLimits instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LSPFeeLimits instance
     */
    public static create(properties?: types.ILSPFeeLimits): types.LSPFeeLimits;

    /**
     * Encodes the specified LSPFeeLimits message. Does not implicitly {@link types.LSPFeeLimits.verify|verify} messages.
     * @param message LSPFeeLimits message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.ILSPFeeLimits,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified LSPFeeLimits message, length delimited. Does not implicitly {@link types.LSPFeeLimits.verify|verify} messages.
     * @param message LSPFeeLimits message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.ILSPFeeLimits,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a LSPFeeLimits message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LSPFeeLimits
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.LSPFeeLimits;

    /**
     * Decodes a LSPFeeLimits message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LSPFeeLimits
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.LSPFeeLimits;

    /**
     * Verifies a LSPFeeLimits message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a LSPFeeLimits message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LSPFeeLimits
     */
    public static fromObject(object: { [k: string]: any }): types.LSPFeeLimits;

    /**
     * Creates a plain object from a LSPFeeLimits message. Also converts values to other types if specified.
     * @param message LSPFeeLimits
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.LSPFeeLimits,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this LSPFeeLimits to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for LSPFeeLimits
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** PaymentDirection enum. */
  enum PaymentDirection {
    INBOUND = 0,
    OUTBOUND = 1,
  }

  /** PaymentStatus enum. */
  enum PaymentStatus {
    PENDING = 0,
    SUCCEEDED = 1,
    FAILED = 2,
  }

  /** Properties of a ForwardedPayment. */
  interface IForwardedPayment {
    /** ForwardedPayment prevChannelId */
    prevChannelId?: string | null;

    /** ForwardedPayment nextChannelId */
    nextChannelId?: string | null;

    /** ForwardedPayment prevUserChannelId */
    prevUserChannelId?: string | null;

    /** ForwardedPayment prevNodeId */
    prevNodeId?: string | null;

    /** ForwardedPayment nextNodeId */
    nextNodeId?: string | null;

    /** ForwardedPayment nextUserChannelId */
    nextUserChannelId?: string | null;

    /** ForwardedPayment totalFeeEarnedMsat */
    totalFeeEarnedMsat?: number | Long | null;

    /** ForwardedPayment skimmedFeeMsat */
    skimmedFeeMsat?: number | Long | null;

    /** ForwardedPayment claimFromOnchainTx */
    claimFromOnchainTx?: boolean | null;

    /** ForwardedPayment outboundAmountForwardedMsat */
    outboundAmountForwardedMsat?: number | Long | null;
  }

  /** Represents a ForwardedPayment. */
  class ForwardedPayment implements IForwardedPayment {
    /**
     * Constructs a new ForwardedPayment.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IForwardedPayment);

    /** ForwardedPayment prevChannelId. */
    public prevChannelId: string;

    /** ForwardedPayment nextChannelId. */
    public nextChannelId: string;

    /** ForwardedPayment prevUserChannelId. */
    public prevUserChannelId: string;

    /** ForwardedPayment prevNodeId. */
    public prevNodeId: string;

    /** ForwardedPayment nextNodeId. */
    public nextNodeId: string;

    /** ForwardedPayment nextUserChannelId. */
    public nextUserChannelId?: string | null;

    /** ForwardedPayment totalFeeEarnedMsat. */
    public totalFeeEarnedMsat?: number | Long | null;

    /** ForwardedPayment skimmedFeeMsat. */
    public skimmedFeeMsat?: number | Long | null;

    /** ForwardedPayment claimFromOnchainTx. */
    public claimFromOnchainTx: boolean;

    /** ForwardedPayment outboundAmountForwardedMsat. */
    public outboundAmountForwardedMsat?: number | Long | null;

    /**
     * Creates a new ForwardedPayment instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ForwardedPayment instance
     */
    public static create(
      properties?: types.IForwardedPayment
    ): types.ForwardedPayment;

    /**
     * Encodes the specified ForwardedPayment message. Does not implicitly {@link types.ForwardedPayment.verify|verify} messages.
     * @param message ForwardedPayment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IForwardedPayment,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ForwardedPayment message, length delimited. Does not implicitly {@link types.ForwardedPayment.verify|verify} messages.
     * @param message ForwardedPayment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IForwardedPayment,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ForwardedPayment message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ForwardedPayment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ForwardedPayment;

    /**
     * Decodes a ForwardedPayment message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ForwardedPayment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ForwardedPayment;

    /**
     * Verifies a ForwardedPayment message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ForwardedPayment message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ForwardedPayment
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.ForwardedPayment;

    /**
     * Creates a plain object from a ForwardedPayment message. Also converts values to other types if specified.
     * @param message ForwardedPayment
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ForwardedPayment,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ForwardedPayment to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ForwardedPayment
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Channel. */
  interface IChannel {
    /** Channel channelId */
    channelId?: string | null;

    /** Channel counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** Channel fundingTxo */
    fundingTxo?: types.IOutPoint | null;

    /** Channel userChannelId */
    userChannelId?: string | null;

    /** Channel unspendablePunishmentReserve */
    unspendablePunishmentReserve?: number | Long | null;

    /** Channel channelValueSats */
    channelValueSats?: number | Long | null;

    /** Channel feerateSatPer_1000Weight */
    feerateSatPer_1000Weight?: number | null;

    /** Channel outboundCapacityMsat */
    outboundCapacityMsat?: number | Long | null;

    /** Channel inboundCapacityMsat */
    inboundCapacityMsat?: number | Long | null;

    /** Channel confirmationsRequired */
    confirmationsRequired?: number | null;

    /** Channel confirmations */
    confirmations?: number | null;

    /** Channel isOutbound */
    isOutbound?: boolean | null;

    /** Channel isChannelReady */
    isChannelReady?: boolean | null;

    /** Channel isUsable */
    isUsable?: boolean | null;

    /** Channel isAnnounced */
    isAnnounced?: boolean | null;

    /** Channel channelConfig */
    channelConfig?: types.IChannelConfig | null;

    /** Channel nextOutboundHtlcLimitMsat */
    nextOutboundHtlcLimitMsat?: number | Long | null;

    /** Channel nextOutboundHtlcMinimumMsat */
    nextOutboundHtlcMinimumMsat?: number | Long | null;

    /** Channel forceCloseSpendDelay */
    forceCloseSpendDelay?: number | null;

    /** Channel counterpartyOutboundHtlcMinimumMsat */
    counterpartyOutboundHtlcMinimumMsat?: number | Long | null;

    /** Channel counterpartyOutboundHtlcMaximumMsat */
    counterpartyOutboundHtlcMaximumMsat?: number | Long | null;

    /** Channel counterpartyUnspendablePunishmentReserve */
    counterpartyUnspendablePunishmentReserve?: number | Long | null;

    /** Channel counterpartyForwardingInfoFeeBaseMsat */
    counterpartyForwardingInfoFeeBaseMsat?: number | null;

    /** Channel counterpartyForwardingInfoFeeProportionalMillionths */
    counterpartyForwardingInfoFeeProportionalMillionths?: number | null;

    /** Channel counterpartyForwardingInfoCltvExpiryDelta */
    counterpartyForwardingInfoCltvExpiryDelta?: number | null;
  }

  /** Represents a Channel. */
  class Channel implements IChannel {
    /**
     * Constructs a new Channel.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IChannel);

    /** Channel channelId. */
    public channelId: string;

    /** Channel counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** Channel fundingTxo. */
    public fundingTxo?: types.IOutPoint | null;

    /** Channel userChannelId. */
    public userChannelId: string;

    /** Channel unspendablePunishmentReserve. */
    public unspendablePunishmentReserve?: number | Long | null;

    /** Channel channelValueSats. */
    public channelValueSats: number | Long;

    /** Channel feerateSatPer_1000Weight. */
    public feerateSatPer_1000Weight: number;

    /** Channel outboundCapacityMsat. */
    public outboundCapacityMsat: number | Long;

    /** Channel inboundCapacityMsat. */
    public inboundCapacityMsat: number | Long;

    /** Channel confirmationsRequired. */
    public confirmationsRequired?: number | null;

    /** Channel confirmations. */
    public confirmations?: number | null;

    /** Channel isOutbound. */
    public isOutbound: boolean;

    /** Channel isChannelReady. */
    public isChannelReady: boolean;

    /** Channel isUsable. */
    public isUsable: boolean;

    /** Channel isAnnounced. */
    public isAnnounced: boolean;

    /** Channel channelConfig. */
    public channelConfig?: types.IChannelConfig | null;

    /** Channel nextOutboundHtlcLimitMsat. */
    public nextOutboundHtlcLimitMsat: number | Long;

    /** Channel nextOutboundHtlcMinimumMsat. */
    public nextOutboundHtlcMinimumMsat: number | Long;

    /** Channel forceCloseSpendDelay. */
    public forceCloseSpendDelay?: number | null;

    /** Channel counterpartyOutboundHtlcMinimumMsat. */
    public counterpartyOutboundHtlcMinimumMsat?: number | Long | null;

    /** Channel counterpartyOutboundHtlcMaximumMsat. */
    public counterpartyOutboundHtlcMaximumMsat?: number | Long | null;

    /** Channel counterpartyUnspendablePunishmentReserve. */
    public counterpartyUnspendablePunishmentReserve: number | Long;

    /** Channel counterpartyForwardingInfoFeeBaseMsat. */
    public counterpartyForwardingInfoFeeBaseMsat?: number | null;

    /** Channel counterpartyForwardingInfoFeeProportionalMillionths. */
    public counterpartyForwardingInfoFeeProportionalMillionths?: number | null;

    /** Channel counterpartyForwardingInfoCltvExpiryDelta. */
    public counterpartyForwardingInfoCltvExpiryDelta?: number | null;

    /**
     * Creates a new Channel instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Channel instance
     */
    public static create(properties?: types.IChannel): types.Channel;

    /**
     * Encodes the specified Channel message. Does not implicitly {@link types.Channel.verify|verify} messages.
     * @param message Channel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IChannel,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Channel message, length delimited. Does not implicitly {@link types.Channel.verify|verify} messages.
     * @param message Channel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IChannel,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Channel message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Channel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Channel;

    /**
     * Decodes a Channel message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Channel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Channel;

    /**
     * Verifies a Channel message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Channel message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Channel
     */
    public static fromObject(object: { [k: string]: any }): types.Channel;

    /**
     * Creates a plain object from a Channel message. Also converts values to other types if specified.
     * @param message Channel
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Channel,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Channel to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Channel
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ChannelConfig. */
  interface IChannelConfig {
    /** ChannelConfig forwardingFeeProportionalMillionths */
    forwardingFeeProportionalMillionths?: number | null;

    /** ChannelConfig forwardingFeeBaseMsat */
    forwardingFeeBaseMsat?: number | null;

    /** ChannelConfig cltvExpiryDelta */
    cltvExpiryDelta?: number | null;

    /** ChannelConfig forceCloseAvoidanceMaxFeeSatoshis */
    forceCloseAvoidanceMaxFeeSatoshis?: number | Long | null;

    /** ChannelConfig acceptUnderpayingHtlcs */
    acceptUnderpayingHtlcs?: boolean | null;

    /** ChannelConfig fixedLimitMsat */
    fixedLimitMsat?: number | Long | null;

    /** ChannelConfig feeRateMultiplier */
    feeRateMultiplier?: number | Long | null;
  }

  /** Represents a ChannelConfig. */
  class ChannelConfig implements IChannelConfig {
    /**
     * Constructs a new ChannelConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IChannelConfig);

    /** ChannelConfig forwardingFeeProportionalMillionths. */
    public forwardingFeeProportionalMillionths?: number | null;

    /** ChannelConfig forwardingFeeBaseMsat. */
    public forwardingFeeBaseMsat?: number | null;

    /** ChannelConfig cltvExpiryDelta. */
    public cltvExpiryDelta?: number | null;

    /** ChannelConfig forceCloseAvoidanceMaxFeeSatoshis. */
    public forceCloseAvoidanceMaxFeeSatoshis?: number | Long | null;

    /** ChannelConfig acceptUnderpayingHtlcs. */
    public acceptUnderpayingHtlcs?: boolean | null;

    /** ChannelConfig fixedLimitMsat. */
    public fixedLimitMsat?: number | Long | null;

    /** ChannelConfig feeRateMultiplier. */
    public feeRateMultiplier?: number | Long | null;

    /** ChannelConfig maxDustHtlcExposure. */
    public maxDustHtlcExposure?: 'fixedLimitMsat' | 'feeRateMultiplier';

    /**
     * Creates a new ChannelConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ChannelConfig instance
     */
    public static create(
      properties?: types.IChannelConfig
    ): types.ChannelConfig;

    /**
     * Encodes the specified ChannelConfig message. Does not implicitly {@link types.ChannelConfig.verify|verify} messages.
     * @param message ChannelConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IChannelConfig,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ChannelConfig message, length delimited. Does not implicitly {@link types.ChannelConfig.verify|verify} messages.
     * @param message ChannelConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IChannelConfig,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ChannelConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ChannelConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ChannelConfig;

    /**
     * Decodes a ChannelConfig message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ChannelConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ChannelConfig;

    /**
     * Verifies a ChannelConfig message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ChannelConfig message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ChannelConfig
     */
    public static fromObject(object: { [k: string]: any }): types.ChannelConfig;

    /**
     * Creates a plain object from a ChannelConfig message. Also converts values to other types if specified.
     * @param message ChannelConfig
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ChannelConfig,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ChannelConfig to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ChannelConfig
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OutPoint. */
  interface IOutPoint {
    /** OutPoint txid */
    txid?: string | null;

    /** OutPoint vout */
    vout?: number | null;
  }

  /** Represents an OutPoint. */
  class OutPoint implements IOutPoint {
    /**
     * Constructs a new OutPoint.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IOutPoint);

    /** OutPoint txid. */
    public txid: string;

    /** OutPoint vout. */
    public vout: number;

    /**
     * Creates a new OutPoint instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OutPoint instance
     */
    public static create(properties?: types.IOutPoint): types.OutPoint;

    /**
     * Encodes the specified OutPoint message. Does not implicitly {@link types.OutPoint.verify|verify} messages.
     * @param message OutPoint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IOutPoint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OutPoint message, length delimited. Does not implicitly {@link types.OutPoint.verify|verify} messages.
     * @param message OutPoint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IOutPoint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OutPoint message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OutPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.OutPoint;

    /**
     * Decodes an OutPoint message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OutPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.OutPoint;

    /**
     * Verifies an OutPoint message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OutPoint message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OutPoint
     */
    public static fromObject(object: { [k: string]: any }): types.OutPoint;

    /**
     * Creates a plain object from an OutPoint message. Also converts values to other types if specified.
     * @param message OutPoint
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.OutPoint,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OutPoint to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OutPoint
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a BestBlock. */
  interface IBestBlock {
    /** BestBlock blockHash */
    blockHash?: string | null;

    /** BestBlock height */
    height?: number | null;
  }

  /** Represents a BestBlock. */
  class BestBlock implements IBestBlock {
    /**
     * Constructs a new BestBlock.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBestBlock);

    /** BestBlock blockHash. */
    public blockHash: string;

    /** BestBlock height. */
    public height: number;

    /**
     * Creates a new BestBlock instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BestBlock instance
     */
    public static create(properties?: types.IBestBlock): types.BestBlock;

    /**
     * Encodes the specified BestBlock message. Does not implicitly {@link types.BestBlock.verify|verify} messages.
     * @param message BestBlock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBestBlock,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified BestBlock message, length delimited. Does not implicitly {@link types.BestBlock.verify|verify} messages.
     * @param message BestBlock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBestBlock,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a BestBlock message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BestBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.BestBlock;

    /**
     * Decodes a BestBlock message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BestBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.BestBlock;

    /**
     * Verifies a BestBlock message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a BestBlock message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BestBlock
     */
    public static fromObject(object: { [k: string]: any }): types.BestBlock;

    /**
     * Creates a plain object from a BestBlock message. Also converts values to other types if specified.
     * @param message BestBlock
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.BestBlock,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this BestBlock to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BestBlock
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a LightningBalance. */
  interface ILightningBalance {
    /** LightningBalance claimableOnChannelClose */
    claimableOnChannelClose?: types.IClaimableOnChannelClose | null;

    /** LightningBalance claimableAwaitingConfirmations */
    claimableAwaitingConfirmations?: types.IClaimableAwaitingConfirmations | null;

    /** LightningBalance contentiousClaimable */
    contentiousClaimable?: types.IContentiousClaimable | null;

    /** LightningBalance maybeTimeoutClaimableHtlc */
    maybeTimeoutClaimableHtlc?: types.IMaybeTimeoutClaimableHTLC | null;

    /** LightningBalance maybePreimageClaimableHtlc */
    maybePreimageClaimableHtlc?: types.IMaybePreimageClaimableHTLC | null;

    /** LightningBalance counterpartyRevokedOutputClaimable */
    counterpartyRevokedOutputClaimable?: types.ICounterpartyRevokedOutputClaimable | null;
  }

  /** Represents a LightningBalance. */
  class LightningBalance implements ILightningBalance {
    /**
     * Constructs a new LightningBalance.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.ILightningBalance);

    /** LightningBalance claimableOnChannelClose. */
    public claimableOnChannelClose?: types.IClaimableOnChannelClose | null;

    /** LightningBalance claimableAwaitingConfirmations. */
    public claimableAwaitingConfirmations?: types.IClaimableAwaitingConfirmations | null;

    /** LightningBalance contentiousClaimable. */
    public contentiousClaimable?: types.IContentiousClaimable | null;

    /** LightningBalance maybeTimeoutClaimableHtlc. */
    public maybeTimeoutClaimableHtlc?: types.IMaybeTimeoutClaimableHTLC | null;

    /** LightningBalance maybePreimageClaimableHtlc. */
    public maybePreimageClaimableHtlc?: types.IMaybePreimageClaimableHTLC | null;

    /** LightningBalance counterpartyRevokedOutputClaimable. */
    public counterpartyRevokedOutputClaimable?: types.ICounterpartyRevokedOutputClaimable | null;

    /** LightningBalance balanceType. */
    public balanceType?:
      | 'claimableOnChannelClose'
      | 'claimableAwaitingConfirmations'
      | 'contentiousClaimable'
      | 'maybeTimeoutClaimableHtlc'
      | 'maybePreimageClaimableHtlc'
      | 'counterpartyRevokedOutputClaimable';

    /**
     * Creates a new LightningBalance instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LightningBalance instance
     */
    public static create(
      properties?: types.ILightningBalance
    ): types.LightningBalance;

    /**
     * Encodes the specified LightningBalance message. Does not implicitly {@link types.LightningBalance.verify|verify} messages.
     * @param message LightningBalance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.ILightningBalance,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified LightningBalance message, length delimited. Does not implicitly {@link types.LightningBalance.verify|verify} messages.
     * @param message LightningBalance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.ILightningBalance,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a LightningBalance message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LightningBalance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.LightningBalance;

    /**
     * Decodes a LightningBalance message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LightningBalance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.LightningBalance;

    /**
     * Verifies a LightningBalance message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a LightningBalance message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LightningBalance
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.LightningBalance;

    /**
     * Creates a plain object from a LightningBalance message. Also converts values to other types if specified.
     * @param message LightningBalance
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.LightningBalance,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this LightningBalance to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for LightningBalance
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ClaimableOnChannelClose. */
  interface IClaimableOnChannelClose {
    /** ClaimableOnChannelClose channelId */
    channelId?: string | null;

    /** ClaimableOnChannelClose counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** ClaimableOnChannelClose amountSatoshis */
    amountSatoshis?: number | Long | null;

    /** ClaimableOnChannelClose transactionFeeSatoshis */
    transactionFeeSatoshis?: number | Long | null;

    /** ClaimableOnChannelClose outboundPaymentHtlcRoundedMsat */
    outboundPaymentHtlcRoundedMsat?: number | Long | null;

    /** ClaimableOnChannelClose outboundForwardedHtlcRoundedMsat */
    outboundForwardedHtlcRoundedMsat?: number | Long | null;

    /** ClaimableOnChannelClose inboundClaimingHtlcRoundedMsat */
    inboundClaimingHtlcRoundedMsat?: number | Long | null;

    /** ClaimableOnChannelClose inboundHtlcRoundedMsat */
    inboundHtlcRoundedMsat?: number | Long | null;
  }

  /** Represents a ClaimableOnChannelClose. */
  class ClaimableOnChannelClose implements IClaimableOnChannelClose {
    /**
     * Constructs a new ClaimableOnChannelClose.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IClaimableOnChannelClose);

    /** ClaimableOnChannelClose channelId. */
    public channelId: string;

    /** ClaimableOnChannelClose counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** ClaimableOnChannelClose amountSatoshis. */
    public amountSatoshis: number | Long;

    /** ClaimableOnChannelClose transactionFeeSatoshis. */
    public transactionFeeSatoshis: number | Long;

    /** ClaimableOnChannelClose outboundPaymentHtlcRoundedMsat. */
    public outboundPaymentHtlcRoundedMsat: number | Long;

    /** ClaimableOnChannelClose outboundForwardedHtlcRoundedMsat. */
    public outboundForwardedHtlcRoundedMsat: number | Long;

    /** ClaimableOnChannelClose inboundClaimingHtlcRoundedMsat. */
    public inboundClaimingHtlcRoundedMsat: number | Long;

    /** ClaimableOnChannelClose inboundHtlcRoundedMsat. */
    public inboundHtlcRoundedMsat: number | Long;

    /**
     * Creates a new ClaimableOnChannelClose instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ClaimableOnChannelClose instance
     */
    public static create(
      properties?: types.IClaimableOnChannelClose
    ): types.ClaimableOnChannelClose;

    /**
     * Encodes the specified ClaimableOnChannelClose message. Does not implicitly {@link types.ClaimableOnChannelClose.verify|verify} messages.
     * @param message ClaimableOnChannelClose message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IClaimableOnChannelClose,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ClaimableOnChannelClose message, length delimited. Does not implicitly {@link types.ClaimableOnChannelClose.verify|verify} messages.
     * @param message ClaimableOnChannelClose message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IClaimableOnChannelClose,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ClaimableOnChannelClose message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ClaimableOnChannelClose
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ClaimableOnChannelClose;

    /**
     * Decodes a ClaimableOnChannelClose message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ClaimableOnChannelClose
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ClaimableOnChannelClose;

    /**
     * Verifies a ClaimableOnChannelClose message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ClaimableOnChannelClose message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ClaimableOnChannelClose
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.ClaimableOnChannelClose;

    /**
     * Creates a plain object from a ClaimableOnChannelClose message. Also converts values to other types if specified.
     * @param message ClaimableOnChannelClose
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ClaimableOnChannelClose,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ClaimableOnChannelClose to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ClaimableOnChannelClose
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ClaimableAwaitingConfirmations. */
  interface IClaimableAwaitingConfirmations {
    /** ClaimableAwaitingConfirmations channelId */
    channelId?: string | null;

    /** ClaimableAwaitingConfirmations counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** ClaimableAwaitingConfirmations amountSatoshis */
    amountSatoshis?: number | Long | null;

    /** ClaimableAwaitingConfirmations confirmationHeight */
    confirmationHeight?: number | null;

    /** ClaimableAwaitingConfirmations source */
    source?: types.BalanceSource | null;
  }

  /** Represents a ClaimableAwaitingConfirmations. */
  class ClaimableAwaitingConfirmations implements IClaimableAwaitingConfirmations {
    /**
     * Constructs a new ClaimableAwaitingConfirmations.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IClaimableAwaitingConfirmations);

    /** ClaimableAwaitingConfirmations channelId. */
    public channelId: string;

    /** ClaimableAwaitingConfirmations counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** ClaimableAwaitingConfirmations amountSatoshis. */
    public amountSatoshis: number | Long;

    /** ClaimableAwaitingConfirmations confirmationHeight. */
    public confirmationHeight: number;

    /** ClaimableAwaitingConfirmations source. */
    public source: types.BalanceSource;

    /**
     * Creates a new ClaimableAwaitingConfirmations instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ClaimableAwaitingConfirmations instance
     */
    public static create(
      properties?: types.IClaimableAwaitingConfirmations
    ): types.ClaimableAwaitingConfirmations;

    /**
     * Encodes the specified ClaimableAwaitingConfirmations message. Does not implicitly {@link types.ClaimableAwaitingConfirmations.verify|verify} messages.
     * @param message ClaimableAwaitingConfirmations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IClaimableAwaitingConfirmations,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ClaimableAwaitingConfirmations message, length delimited. Does not implicitly {@link types.ClaimableAwaitingConfirmations.verify|verify} messages.
     * @param message ClaimableAwaitingConfirmations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IClaimableAwaitingConfirmations,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ClaimableAwaitingConfirmations message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ClaimableAwaitingConfirmations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ClaimableAwaitingConfirmations;

    /**
     * Decodes a ClaimableAwaitingConfirmations message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ClaimableAwaitingConfirmations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ClaimableAwaitingConfirmations;

    /**
     * Verifies a ClaimableAwaitingConfirmations message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ClaimableAwaitingConfirmations message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ClaimableAwaitingConfirmations
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.ClaimableAwaitingConfirmations;

    /**
     * Creates a plain object from a ClaimableAwaitingConfirmations message. Also converts values to other types if specified.
     * @param message ClaimableAwaitingConfirmations
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ClaimableAwaitingConfirmations,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ClaimableAwaitingConfirmations to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ClaimableAwaitingConfirmations
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** BalanceSource enum. */
  enum BalanceSource {
    HOLDER_FORCE_CLOSED = 0,
    COUNTERPARTY_FORCE_CLOSED = 1,
    COOP_CLOSE = 2,
    HTLC = 3,
  }

  /** Properties of a ContentiousClaimable. */
  interface IContentiousClaimable {
    /** ContentiousClaimable channelId */
    channelId?: string | null;

    /** ContentiousClaimable counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** ContentiousClaimable amountSatoshis */
    amountSatoshis?: number | Long | null;

    /** ContentiousClaimable timeoutHeight */
    timeoutHeight?: number | null;

    /** ContentiousClaimable paymentHash */
    paymentHash?: string | null;

    /** ContentiousClaimable paymentPreimage */
    paymentPreimage?: string | null;
  }

  /** Represents a ContentiousClaimable. */
  class ContentiousClaimable implements IContentiousClaimable {
    /**
     * Constructs a new ContentiousClaimable.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IContentiousClaimable);

    /** ContentiousClaimable channelId. */
    public channelId: string;

    /** ContentiousClaimable counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** ContentiousClaimable amountSatoshis. */
    public amountSatoshis: number | Long;

    /** ContentiousClaimable timeoutHeight. */
    public timeoutHeight: number;

    /** ContentiousClaimable paymentHash. */
    public paymentHash: string;

    /** ContentiousClaimable paymentPreimage. */
    public paymentPreimage: string;

    /**
     * Creates a new ContentiousClaimable instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ContentiousClaimable instance
     */
    public static create(
      properties?: types.IContentiousClaimable
    ): types.ContentiousClaimable;

    /**
     * Encodes the specified ContentiousClaimable message. Does not implicitly {@link types.ContentiousClaimable.verify|verify} messages.
     * @param message ContentiousClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IContentiousClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ContentiousClaimable message, length delimited. Does not implicitly {@link types.ContentiousClaimable.verify|verify} messages.
     * @param message ContentiousClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IContentiousClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a ContentiousClaimable message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ContentiousClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.ContentiousClaimable;

    /**
     * Decodes a ContentiousClaimable message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ContentiousClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.ContentiousClaimable;

    /**
     * Verifies a ContentiousClaimable message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ContentiousClaimable message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ContentiousClaimable
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.ContentiousClaimable;

    /**
     * Creates a plain object from a ContentiousClaimable message. Also converts values to other types if specified.
     * @param message ContentiousClaimable
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.ContentiousClaimable,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ContentiousClaimable to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ContentiousClaimable
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MaybeTimeoutClaimableHTLC. */
  interface IMaybeTimeoutClaimableHTLC {
    /** MaybeTimeoutClaimableHTLC channelId */
    channelId?: string | null;

    /** MaybeTimeoutClaimableHTLC counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** MaybeTimeoutClaimableHTLC amountSatoshis */
    amountSatoshis?: number | Long | null;

    /** MaybeTimeoutClaimableHTLC claimableHeight */
    claimableHeight?: number | null;

    /** MaybeTimeoutClaimableHTLC paymentHash */
    paymentHash?: string | null;

    /** MaybeTimeoutClaimableHTLC outboundPayment */
    outboundPayment?: boolean | null;
  }

  /** Represents a MaybeTimeoutClaimableHTLC. */
  class MaybeTimeoutClaimableHTLC implements IMaybeTimeoutClaimableHTLC {
    /**
     * Constructs a new MaybeTimeoutClaimableHTLC.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IMaybeTimeoutClaimableHTLC);

    /** MaybeTimeoutClaimableHTLC channelId. */
    public channelId: string;

    /** MaybeTimeoutClaimableHTLC counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** MaybeTimeoutClaimableHTLC amountSatoshis. */
    public amountSatoshis: number | Long;

    /** MaybeTimeoutClaimableHTLC claimableHeight. */
    public claimableHeight: number;

    /** MaybeTimeoutClaimableHTLC paymentHash. */
    public paymentHash: string;

    /** MaybeTimeoutClaimableHTLC outboundPayment. */
    public outboundPayment: boolean;

    /**
     * Creates a new MaybeTimeoutClaimableHTLC instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MaybeTimeoutClaimableHTLC instance
     */
    public static create(
      properties?: types.IMaybeTimeoutClaimableHTLC
    ): types.MaybeTimeoutClaimableHTLC;

    /**
     * Encodes the specified MaybeTimeoutClaimableHTLC message. Does not implicitly {@link types.MaybeTimeoutClaimableHTLC.verify|verify} messages.
     * @param message MaybeTimeoutClaimableHTLC message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IMaybeTimeoutClaimableHTLC,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified MaybeTimeoutClaimableHTLC message, length delimited. Does not implicitly {@link types.MaybeTimeoutClaimableHTLC.verify|verify} messages.
     * @param message MaybeTimeoutClaimableHTLC message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IMaybeTimeoutClaimableHTLC,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a MaybeTimeoutClaimableHTLC message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MaybeTimeoutClaimableHTLC
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.MaybeTimeoutClaimableHTLC;

    /**
     * Decodes a MaybeTimeoutClaimableHTLC message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MaybeTimeoutClaimableHTLC
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.MaybeTimeoutClaimableHTLC;

    /**
     * Verifies a MaybeTimeoutClaimableHTLC message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MaybeTimeoutClaimableHTLC message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MaybeTimeoutClaimableHTLC
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.MaybeTimeoutClaimableHTLC;

    /**
     * Creates a plain object from a MaybeTimeoutClaimableHTLC message. Also converts values to other types if specified.
     * @param message MaybeTimeoutClaimableHTLC
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.MaybeTimeoutClaimableHTLC,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this MaybeTimeoutClaimableHTLC to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MaybeTimeoutClaimableHTLC
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MaybePreimageClaimableHTLC. */
  interface IMaybePreimageClaimableHTLC {
    /** MaybePreimageClaimableHTLC channelId */
    channelId?: string | null;

    /** MaybePreimageClaimableHTLC counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** MaybePreimageClaimableHTLC amountSatoshis */
    amountSatoshis?: number | Long | null;

    /** MaybePreimageClaimableHTLC expiryHeight */
    expiryHeight?: number | null;

    /** MaybePreimageClaimableHTLC paymentHash */
    paymentHash?: string | null;
  }

  /** Represents a MaybePreimageClaimableHTLC. */
  class MaybePreimageClaimableHTLC implements IMaybePreimageClaimableHTLC {
    /**
     * Constructs a new MaybePreimageClaimableHTLC.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IMaybePreimageClaimableHTLC);

    /** MaybePreimageClaimableHTLC channelId. */
    public channelId: string;

    /** MaybePreimageClaimableHTLC counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** MaybePreimageClaimableHTLC amountSatoshis. */
    public amountSatoshis: number | Long;

    /** MaybePreimageClaimableHTLC expiryHeight. */
    public expiryHeight: number;

    /** MaybePreimageClaimableHTLC paymentHash. */
    public paymentHash: string;

    /**
     * Creates a new MaybePreimageClaimableHTLC instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MaybePreimageClaimableHTLC instance
     */
    public static create(
      properties?: types.IMaybePreimageClaimableHTLC
    ): types.MaybePreimageClaimableHTLC;

    /**
     * Encodes the specified MaybePreimageClaimableHTLC message. Does not implicitly {@link types.MaybePreimageClaimableHTLC.verify|verify} messages.
     * @param message MaybePreimageClaimableHTLC message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IMaybePreimageClaimableHTLC,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified MaybePreimageClaimableHTLC message, length delimited. Does not implicitly {@link types.MaybePreimageClaimableHTLC.verify|verify} messages.
     * @param message MaybePreimageClaimableHTLC message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IMaybePreimageClaimableHTLC,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a MaybePreimageClaimableHTLC message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MaybePreimageClaimableHTLC
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.MaybePreimageClaimableHTLC;

    /**
     * Decodes a MaybePreimageClaimableHTLC message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MaybePreimageClaimableHTLC
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.MaybePreimageClaimableHTLC;

    /**
     * Verifies a MaybePreimageClaimableHTLC message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MaybePreimageClaimableHTLC message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MaybePreimageClaimableHTLC
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.MaybePreimageClaimableHTLC;

    /**
     * Creates a plain object from a MaybePreimageClaimableHTLC message. Also converts values to other types if specified.
     * @param message MaybePreimageClaimableHTLC
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.MaybePreimageClaimableHTLC,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this MaybePreimageClaimableHTLC to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MaybePreimageClaimableHTLC
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CounterpartyRevokedOutputClaimable. */
  interface ICounterpartyRevokedOutputClaimable {
    /** CounterpartyRevokedOutputClaimable channelId */
    channelId?: string | null;

    /** CounterpartyRevokedOutputClaimable counterpartyNodeId */
    counterpartyNodeId?: string | null;

    /** CounterpartyRevokedOutputClaimable amountSatoshis */
    amountSatoshis?: number | Long | null;
  }

  /** Represents a CounterpartyRevokedOutputClaimable. */
  class CounterpartyRevokedOutputClaimable implements ICounterpartyRevokedOutputClaimable {
    /**
     * Constructs a new CounterpartyRevokedOutputClaimable.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.ICounterpartyRevokedOutputClaimable);

    /** CounterpartyRevokedOutputClaimable channelId. */
    public channelId: string;

    /** CounterpartyRevokedOutputClaimable counterpartyNodeId. */
    public counterpartyNodeId: string;

    /** CounterpartyRevokedOutputClaimable amountSatoshis. */
    public amountSatoshis: number | Long;

    /**
     * Creates a new CounterpartyRevokedOutputClaimable instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CounterpartyRevokedOutputClaimable instance
     */
    public static create(
      properties?: types.ICounterpartyRevokedOutputClaimable
    ): types.CounterpartyRevokedOutputClaimable;

    /**
     * Encodes the specified CounterpartyRevokedOutputClaimable message. Does not implicitly {@link types.CounterpartyRevokedOutputClaimable.verify|verify} messages.
     * @param message CounterpartyRevokedOutputClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.ICounterpartyRevokedOutputClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified CounterpartyRevokedOutputClaimable message, length delimited. Does not implicitly {@link types.CounterpartyRevokedOutputClaimable.verify|verify} messages.
     * @param message CounterpartyRevokedOutputClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.ICounterpartyRevokedOutputClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a CounterpartyRevokedOutputClaimable message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CounterpartyRevokedOutputClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.CounterpartyRevokedOutputClaimable;

    /**
     * Decodes a CounterpartyRevokedOutputClaimable message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CounterpartyRevokedOutputClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.CounterpartyRevokedOutputClaimable;

    /**
     * Verifies a CounterpartyRevokedOutputClaimable message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CounterpartyRevokedOutputClaimable message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CounterpartyRevokedOutputClaimable
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.CounterpartyRevokedOutputClaimable;

    /**
     * Creates a plain object from a CounterpartyRevokedOutputClaimable message. Also converts values to other types if specified.
     * @param message CounterpartyRevokedOutputClaimable
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.CounterpartyRevokedOutputClaimable,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this CounterpartyRevokedOutputClaimable to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CounterpartyRevokedOutputClaimable
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PendingSweepBalance. */
  interface IPendingSweepBalance {
    /** PendingSweepBalance pendingBroadcast */
    pendingBroadcast?: types.IPendingBroadcast | null;

    /** PendingSweepBalance broadcastAwaitingConfirmation */
    broadcastAwaitingConfirmation?: types.IBroadcastAwaitingConfirmation | null;

    /** PendingSweepBalance awaitingThresholdConfirmations */
    awaitingThresholdConfirmations?: types.IAwaitingThresholdConfirmations | null;
  }

  /** Represents a PendingSweepBalance. */
  class PendingSweepBalance implements IPendingSweepBalance {
    /**
     * Constructs a new PendingSweepBalance.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPendingSweepBalance);

    /** PendingSweepBalance pendingBroadcast. */
    public pendingBroadcast?: types.IPendingBroadcast | null;

    /** PendingSweepBalance broadcastAwaitingConfirmation. */
    public broadcastAwaitingConfirmation?: types.IBroadcastAwaitingConfirmation | null;

    /** PendingSweepBalance awaitingThresholdConfirmations. */
    public awaitingThresholdConfirmations?: types.IAwaitingThresholdConfirmations | null;

    /** PendingSweepBalance balanceType. */
    public balanceType?:
      | 'pendingBroadcast'
      | 'broadcastAwaitingConfirmation'
      | 'awaitingThresholdConfirmations';

    /**
     * Creates a new PendingSweepBalance instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PendingSweepBalance instance
     */
    public static create(
      properties?: types.IPendingSweepBalance
    ): types.PendingSweepBalance;

    /**
     * Encodes the specified PendingSweepBalance message. Does not implicitly {@link types.PendingSweepBalance.verify|verify} messages.
     * @param message PendingSweepBalance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPendingSweepBalance,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PendingSweepBalance message, length delimited. Does not implicitly {@link types.PendingSweepBalance.verify|verify} messages.
     * @param message PendingSweepBalance message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPendingSweepBalance,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PendingSweepBalance message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PendingSweepBalance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.PendingSweepBalance;

    /**
     * Decodes a PendingSweepBalance message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PendingSweepBalance
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.PendingSweepBalance;

    /**
     * Verifies a PendingSweepBalance message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PendingSweepBalance message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PendingSweepBalance
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.PendingSweepBalance;

    /**
     * Creates a plain object from a PendingSweepBalance message. Also converts values to other types if specified.
     * @param message PendingSweepBalance
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.PendingSweepBalance,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PendingSweepBalance to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PendingSweepBalance
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PendingBroadcast. */
  interface IPendingBroadcast {
    /** PendingBroadcast channelId */
    channelId?: string | null;

    /** PendingBroadcast amountSatoshis */
    amountSatoshis?: number | Long | null;
  }

  /** Represents a PendingBroadcast. */
  class PendingBroadcast implements IPendingBroadcast {
    /**
     * Constructs a new PendingBroadcast.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPendingBroadcast);

    /** PendingBroadcast channelId. */
    public channelId?: string | null;

    /** PendingBroadcast amountSatoshis. */
    public amountSatoshis: number | Long;

    /**
     * Creates a new PendingBroadcast instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PendingBroadcast instance
     */
    public static create(
      properties?: types.IPendingBroadcast
    ): types.PendingBroadcast;

    /**
     * Encodes the specified PendingBroadcast message. Does not implicitly {@link types.PendingBroadcast.verify|verify} messages.
     * @param message PendingBroadcast message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPendingBroadcast,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PendingBroadcast message, length delimited. Does not implicitly {@link types.PendingBroadcast.verify|verify} messages.
     * @param message PendingBroadcast message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPendingBroadcast,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PendingBroadcast message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PendingBroadcast
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.PendingBroadcast;

    /**
     * Decodes a PendingBroadcast message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PendingBroadcast
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.PendingBroadcast;

    /**
     * Verifies a PendingBroadcast message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PendingBroadcast message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PendingBroadcast
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.PendingBroadcast;

    /**
     * Creates a plain object from a PendingBroadcast message. Also converts values to other types if specified.
     * @param message PendingBroadcast
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.PendingBroadcast,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PendingBroadcast to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PendingBroadcast
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a BroadcastAwaitingConfirmation. */
  interface IBroadcastAwaitingConfirmation {
    /** BroadcastAwaitingConfirmation channelId */
    channelId?: string | null;

    /** BroadcastAwaitingConfirmation latestBroadcastHeight */
    latestBroadcastHeight?: number | null;

    /** BroadcastAwaitingConfirmation latestSpendingTxid */
    latestSpendingTxid?: string | null;

    /** BroadcastAwaitingConfirmation amountSatoshis */
    amountSatoshis?: number | Long | null;
  }

  /** Represents a BroadcastAwaitingConfirmation. */
  class BroadcastAwaitingConfirmation implements IBroadcastAwaitingConfirmation {
    /**
     * Constructs a new BroadcastAwaitingConfirmation.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBroadcastAwaitingConfirmation);

    /** BroadcastAwaitingConfirmation channelId. */
    public channelId?: string | null;

    /** BroadcastAwaitingConfirmation latestBroadcastHeight. */
    public latestBroadcastHeight: number;

    /** BroadcastAwaitingConfirmation latestSpendingTxid. */
    public latestSpendingTxid: string;

    /** BroadcastAwaitingConfirmation amountSatoshis. */
    public amountSatoshis: number | Long;

    /**
     * Creates a new BroadcastAwaitingConfirmation instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BroadcastAwaitingConfirmation instance
     */
    public static create(
      properties?: types.IBroadcastAwaitingConfirmation
    ): types.BroadcastAwaitingConfirmation;

    /**
     * Encodes the specified BroadcastAwaitingConfirmation message. Does not implicitly {@link types.BroadcastAwaitingConfirmation.verify|verify} messages.
     * @param message BroadcastAwaitingConfirmation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBroadcastAwaitingConfirmation,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified BroadcastAwaitingConfirmation message, length delimited. Does not implicitly {@link types.BroadcastAwaitingConfirmation.verify|verify} messages.
     * @param message BroadcastAwaitingConfirmation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBroadcastAwaitingConfirmation,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a BroadcastAwaitingConfirmation message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BroadcastAwaitingConfirmation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.BroadcastAwaitingConfirmation;

    /**
     * Decodes a BroadcastAwaitingConfirmation message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BroadcastAwaitingConfirmation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.BroadcastAwaitingConfirmation;

    /**
     * Verifies a BroadcastAwaitingConfirmation message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a BroadcastAwaitingConfirmation message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BroadcastAwaitingConfirmation
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.BroadcastAwaitingConfirmation;

    /**
     * Creates a plain object from a BroadcastAwaitingConfirmation message. Also converts values to other types if specified.
     * @param message BroadcastAwaitingConfirmation
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.BroadcastAwaitingConfirmation,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this BroadcastAwaitingConfirmation to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BroadcastAwaitingConfirmation
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an AwaitingThresholdConfirmations. */
  interface IAwaitingThresholdConfirmations {
    /** AwaitingThresholdConfirmations channelId */
    channelId?: string | null;

    /** AwaitingThresholdConfirmations latestSpendingTxid */
    latestSpendingTxid?: string | null;

    /** AwaitingThresholdConfirmations confirmationHash */
    confirmationHash?: string | null;

    /** AwaitingThresholdConfirmations confirmationHeight */
    confirmationHeight?: number | null;

    /** AwaitingThresholdConfirmations amountSatoshis */
    amountSatoshis?: number | Long | null;
  }

  /** Represents an AwaitingThresholdConfirmations. */
  class AwaitingThresholdConfirmations implements IAwaitingThresholdConfirmations {
    /**
     * Constructs a new AwaitingThresholdConfirmations.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IAwaitingThresholdConfirmations);

    /** AwaitingThresholdConfirmations channelId. */
    public channelId?: string | null;

    /** AwaitingThresholdConfirmations latestSpendingTxid. */
    public latestSpendingTxid: string;

    /** AwaitingThresholdConfirmations confirmationHash. */
    public confirmationHash: string;

    /** AwaitingThresholdConfirmations confirmationHeight. */
    public confirmationHeight: number;

    /** AwaitingThresholdConfirmations amountSatoshis. */
    public amountSatoshis: number | Long;

    /**
     * Creates a new AwaitingThresholdConfirmations instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AwaitingThresholdConfirmations instance
     */
    public static create(
      properties?: types.IAwaitingThresholdConfirmations
    ): types.AwaitingThresholdConfirmations;

    /**
     * Encodes the specified AwaitingThresholdConfirmations message. Does not implicitly {@link types.AwaitingThresholdConfirmations.verify|verify} messages.
     * @param message AwaitingThresholdConfirmations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IAwaitingThresholdConfirmations,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified AwaitingThresholdConfirmations message, length delimited. Does not implicitly {@link types.AwaitingThresholdConfirmations.verify|verify} messages.
     * @param message AwaitingThresholdConfirmations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IAwaitingThresholdConfirmations,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an AwaitingThresholdConfirmations message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AwaitingThresholdConfirmations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.AwaitingThresholdConfirmations;

    /**
     * Decodes an AwaitingThresholdConfirmations message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AwaitingThresholdConfirmations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.AwaitingThresholdConfirmations;

    /**
     * Verifies an AwaitingThresholdConfirmations message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an AwaitingThresholdConfirmations message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AwaitingThresholdConfirmations
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.AwaitingThresholdConfirmations;

    /**
     * Creates a plain object from an AwaitingThresholdConfirmations message. Also converts values to other types if specified.
     * @param message AwaitingThresholdConfirmations
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.AwaitingThresholdConfirmations,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this AwaitingThresholdConfirmations to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for AwaitingThresholdConfirmations
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PageToken. */
  interface IPageToken {
    /** PageToken token */
    token?: string | null;

    /** PageToken index */
    index?: number | Long | null;
  }

  /** Represents a PageToken. */
  class PageToken implements IPageToken {
    /**
     * Constructs a new PageToken.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPageToken);

    /** PageToken token. */
    public token: string;

    /** PageToken index. */
    public index: number | Long;

    /**
     * Creates a new PageToken instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PageToken instance
     */
    public static create(properties?: types.IPageToken): types.PageToken;

    /**
     * Encodes the specified PageToken message. Does not implicitly {@link types.PageToken.verify|verify} messages.
     * @param message PageToken message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPageToken,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PageToken message, length delimited. Does not implicitly {@link types.PageToken.verify|verify} messages.
     * @param message PageToken message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPageToken,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PageToken message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PageToken
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.PageToken;

    /**
     * Decodes a PageToken message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PageToken
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.PageToken;

    /**
     * Verifies a PageToken message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PageToken message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PageToken
     */
    public static fromObject(object: { [k: string]: any }): types.PageToken;

    /**
     * Creates a plain object from a PageToken message. Also converts values to other types if specified.
     * @param message PageToken
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.PageToken,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PageToken to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PageToken
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11InvoiceDescription. */
  interface IBolt11InvoiceDescription {
    /** Bolt11InvoiceDescription direct */
    direct?: string | null;

    /** Bolt11InvoiceDescription hash */
    hash?: string | null;
  }

  /** Represents a Bolt11InvoiceDescription. */
  class Bolt11InvoiceDescription implements IBolt11InvoiceDescription {
    /**
     * Constructs a new Bolt11InvoiceDescription.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11InvoiceDescription);

    /** Bolt11InvoiceDescription direct. */
    public direct?: string | null;

    /** Bolt11InvoiceDescription hash. */
    public hash?: string | null;

    /** Bolt11InvoiceDescription kind. */
    public kind?: 'direct' | 'hash';

    /**
     * Creates a new Bolt11InvoiceDescription instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11InvoiceDescription instance
     */
    public static create(
      properties?: types.IBolt11InvoiceDescription
    ): types.Bolt11InvoiceDescription;

    /**
     * Encodes the specified Bolt11InvoiceDescription message. Does not implicitly {@link types.Bolt11InvoiceDescription.verify|verify} messages.
     * @param message Bolt11InvoiceDescription message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11InvoiceDescription,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11InvoiceDescription message, length delimited. Does not implicitly {@link types.Bolt11InvoiceDescription.verify|verify} messages.
     * @param message Bolt11InvoiceDescription message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11InvoiceDescription,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11InvoiceDescription message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11InvoiceDescription
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11InvoiceDescription;

    /**
     * Decodes a Bolt11InvoiceDescription message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11InvoiceDescription
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11InvoiceDescription;

    /**
     * Verifies a Bolt11InvoiceDescription message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11InvoiceDescription message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11InvoiceDescription
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.Bolt11InvoiceDescription;

    /**
     * Creates a plain object from a Bolt11InvoiceDescription message. Also converts values to other types if specified.
     * @param message Bolt11InvoiceDescription
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11InvoiceDescription,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11InvoiceDescription to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11InvoiceDescription
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a RouteParametersConfig. */
  interface IRouteParametersConfig {
    /** RouteParametersConfig maxTotalRoutingFeeMsat */
    maxTotalRoutingFeeMsat?: number | Long | null;

    /** RouteParametersConfig maxTotalCltvExpiryDelta */
    maxTotalCltvExpiryDelta?: number | null;

    /** RouteParametersConfig maxPathCount */
    maxPathCount?: number | null;

    /** RouteParametersConfig maxChannelSaturationPowerOfHalf */
    maxChannelSaturationPowerOfHalf?: number | null;
  }

  /** Represents a RouteParametersConfig. */
  class RouteParametersConfig implements IRouteParametersConfig {
    /**
     * Constructs a new RouteParametersConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IRouteParametersConfig);

    /** RouteParametersConfig maxTotalRoutingFeeMsat. */
    public maxTotalRoutingFeeMsat?: number | Long | null;

    /** RouteParametersConfig maxTotalCltvExpiryDelta. */
    public maxTotalCltvExpiryDelta: number;

    /** RouteParametersConfig maxPathCount. */
    public maxPathCount: number;

    /** RouteParametersConfig maxChannelSaturationPowerOfHalf. */
    public maxChannelSaturationPowerOfHalf: number;

    /**
     * Creates a new RouteParametersConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RouteParametersConfig instance
     */
    public static create(
      properties?: types.IRouteParametersConfig
    ): types.RouteParametersConfig;

    /**
     * Encodes the specified RouteParametersConfig message. Does not implicitly {@link types.RouteParametersConfig.verify|verify} messages.
     * @param message RouteParametersConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IRouteParametersConfig,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified RouteParametersConfig message, length delimited. Does not implicitly {@link types.RouteParametersConfig.verify|verify} messages.
     * @param message RouteParametersConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IRouteParametersConfig,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a RouteParametersConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RouteParametersConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.RouteParametersConfig;

    /**
     * Decodes a RouteParametersConfig message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RouteParametersConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.RouteParametersConfig;

    /**
     * Verifies a RouteParametersConfig message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a RouteParametersConfig message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RouteParametersConfig
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.RouteParametersConfig;

    /**
     * Creates a plain object from a RouteParametersConfig message. Also converts values to other types if specified.
     * @param message RouteParametersConfig
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.RouteParametersConfig,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this RouteParametersConfig to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RouteParametersConfig
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphRoutingFees. */
  interface IGraphRoutingFees {
    /** GraphRoutingFees baseMsat */
    baseMsat?: number | null;

    /** GraphRoutingFees proportionalMillionths */
    proportionalMillionths?: number | null;
  }

  /** Represents a GraphRoutingFees. */
  class GraphRoutingFees implements IGraphRoutingFees {
    /**
     * Constructs a new GraphRoutingFees.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IGraphRoutingFees);

    /** GraphRoutingFees baseMsat. */
    public baseMsat: number;

    /** GraphRoutingFees proportionalMillionths. */
    public proportionalMillionths: number;

    /**
     * Creates a new GraphRoutingFees instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphRoutingFees instance
     */
    public static create(
      properties?: types.IGraphRoutingFees
    ): types.GraphRoutingFees;

    /**
     * Encodes the specified GraphRoutingFees message. Does not implicitly {@link types.GraphRoutingFees.verify|verify} messages.
     * @param message GraphRoutingFees message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IGraphRoutingFees,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphRoutingFees message, length delimited. Does not implicitly {@link types.GraphRoutingFees.verify|verify} messages.
     * @param message GraphRoutingFees message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IGraphRoutingFees,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphRoutingFees message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphRoutingFees
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.GraphRoutingFees;

    /**
     * Decodes a GraphRoutingFees message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphRoutingFees
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.GraphRoutingFees;

    /**
     * Verifies a GraphRoutingFees message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphRoutingFees message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphRoutingFees
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.GraphRoutingFees;

    /**
     * Creates a plain object from a GraphRoutingFees message. Also converts values to other types if specified.
     * @param message GraphRoutingFees
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.GraphRoutingFees,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphRoutingFees to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphRoutingFees
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphChannelUpdate. */
  interface IGraphChannelUpdate {
    /** GraphChannelUpdate lastUpdate */
    lastUpdate?: number | null;

    /** GraphChannelUpdate enabled */
    enabled?: boolean | null;

    /** GraphChannelUpdate cltvExpiryDelta */
    cltvExpiryDelta?: number | null;

    /** GraphChannelUpdate htlcMinimumMsat */
    htlcMinimumMsat?: number | Long | null;

    /** GraphChannelUpdate htlcMaximumMsat */
    htlcMaximumMsat?: number | Long | null;

    /** GraphChannelUpdate fees */
    fees?: types.IGraphRoutingFees | null;
  }

  /** Represents a GraphChannelUpdate. */
  class GraphChannelUpdate implements IGraphChannelUpdate {
    /**
     * Constructs a new GraphChannelUpdate.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IGraphChannelUpdate);

    /** GraphChannelUpdate lastUpdate. */
    public lastUpdate: number;

    /** GraphChannelUpdate enabled. */
    public enabled: boolean;

    /** GraphChannelUpdate cltvExpiryDelta. */
    public cltvExpiryDelta: number;

    /** GraphChannelUpdate htlcMinimumMsat. */
    public htlcMinimumMsat: number | Long;

    /** GraphChannelUpdate htlcMaximumMsat. */
    public htlcMaximumMsat: number | Long;

    /** GraphChannelUpdate fees. */
    public fees?: types.IGraphRoutingFees | null;

    /**
     * Creates a new GraphChannelUpdate instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphChannelUpdate instance
     */
    public static create(
      properties?: types.IGraphChannelUpdate
    ): types.GraphChannelUpdate;

    /**
     * Encodes the specified GraphChannelUpdate message. Does not implicitly {@link types.GraphChannelUpdate.verify|verify} messages.
     * @param message GraphChannelUpdate message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IGraphChannelUpdate,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphChannelUpdate message, length delimited. Does not implicitly {@link types.GraphChannelUpdate.verify|verify} messages.
     * @param message GraphChannelUpdate message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IGraphChannelUpdate,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphChannelUpdate message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphChannelUpdate
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.GraphChannelUpdate;

    /**
     * Decodes a GraphChannelUpdate message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphChannelUpdate
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.GraphChannelUpdate;

    /**
     * Verifies a GraphChannelUpdate message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphChannelUpdate message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphChannelUpdate
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.GraphChannelUpdate;

    /**
     * Creates a plain object from a GraphChannelUpdate message. Also converts values to other types if specified.
     * @param message GraphChannelUpdate
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.GraphChannelUpdate,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphChannelUpdate to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphChannelUpdate
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphChannel. */
  interface IGraphChannel {
    /** GraphChannel nodeOne */
    nodeOne?: string | null;

    /** GraphChannel nodeTwo */
    nodeTwo?: string | null;

    /** GraphChannel capacitySats */
    capacitySats?: number | Long | null;

    /** GraphChannel oneToTwo */
    oneToTwo?: types.IGraphChannelUpdate | null;

    /** GraphChannel twoToOne */
    twoToOne?: types.IGraphChannelUpdate | null;
  }

  /** Represents a GraphChannel. */
  class GraphChannel implements IGraphChannel {
    /**
     * Constructs a new GraphChannel.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IGraphChannel);

    /** GraphChannel nodeOne. */
    public nodeOne: string;

    /** GraphChannel nodeTwo. */
    public nodeTwo: string;

    /** GraphChannel capacitySats. */
    public capacitySats?: number | Long | null;

    /** GraphChannel oneToTwo. */
    public oneToTwo?: types.IGraphChannelUpdate | null;

    /** GraphChannel twoToOne. */
    public twoToOne?: types.IGraphChannelUpdate | null;

    /**
     * Creates a new GraphChannel instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphChannel instance
     */
    public static create(properties?: types.IGraphChannel): types.GraphChannel;

    /**
     * Encodes the specified GraphChannel message. Does not implicitly {@link types.GraphChannel.verify|verify} messages.
     * @param message GraphChannel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IGraphChannel,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphChannel message, length delimited. Does not implicitly {@link types.GraphChannel.verify|verify} messages.
     * @param message GraphChannel message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IGraphChannel,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphChannel message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphChannel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.GraphChannel;

    /**
     * Decodes a GraphChannel message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphChannel
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.GraphChannel;

    /**
     * Verifies a GraphChannel message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphChannel message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphChannel
     */
    public static fromObject(object: { [k: string]: any }): types.GraphChannel;

    /**
     * Creates a plain object from a GraphChannel message. Also converts values to other types if specified.
     * @param message GraphChannel
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.GraphChannel,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphChannel to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphChannel
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphNodeAnnouncement. */
  interface IGraphNodeAnnouncement {
    /** GraphNodeAnnouncement lastUpdate */
    lastUpdate?: number | null;

    /** GraphNodeAnnouncement alias */
    alias?: string | null;

    /** GraphNodeAnnouncement rgb */
    rgb?: string | null;

    /** GraphNodeAnnouncement addresses */
    addresses?: string[] | null;
  }

  /** Represents a GraphNodeAnnouncement. */
  class GraphNodeAnnouncement implements IGraphNodeAnnouncement {
    /**
     * Constructs a new GraphNodeAnnouncement.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IGraphNodeAnnouncement);

    /** GraphNodeAnnouncement lastUpdate. */
    public lastUpdate: number;

    /** GraphNodeAnnouncement alias. */
    public alias: string;

    /** GraphNodeAnnouncement rgb. */
    public rgb: string;

    /** GraphNodeAnnouncement addresses. */
    public addresses: string[];

    /**
     * Creates a new GraphNodeAnnouncement instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphNodeAnnouncement instance
     */
    public static create(
      properties?: types.IGraphNodeAnnouncement
    ): types.GraphNodeAnnouncement;

    /**
     * Encodes the specified GraphNodeAnnouncement message. Does not implicitly {@link types.GraphNodeAnnouncement.verify|verify} messages.
     * @param message GraphNodeAnnouncement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IGraphNodeAnnouncement,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphNodeAnnouncement message, length delimited. Does not implicitly {@link types.GraphNodeAnnouncement.verify|verify} messages.
     * @param message GraphNodeAnnouncement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IGraphNodeAnnouncement,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphNodeAnnouncement message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphNodeAnnouncement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.GraphNodeAnnouncement;

    /**
     * Decodes a GraphNodeAnnouncement message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphNodeAnnouncement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.GraphNodeAnnouncement;

    /**
     * Verifies a GraphNodeAnnouncement message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphNodeAnnouncement message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphNodeAnnouncement
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.GraphNodeAnnouncement;

    /**
     * Creates a plain object from a GraphNodeAnnouncement message. Also converts values to other types if specified.
     * @param message GraphNodeAnnouncement
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.GraphNodeAnnouncement,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphNodeAnnouncement to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphNodeAnnouncement
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Peer. */
  interface IPeer {
    /** Peer nodeId */
    nodeId?: string | null;

    /** Peer address */
    address?: string | null;

    /** Peer isPersisted */
    isPersisted?: boolean | null;

    /** Peer isConnected */
    isConnected?: boolean | null;
  }

  /** Represents a Peer. */
  class Peer implements IPeer {
    /**
     * Constructs a new Peer.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IPeer);

    /** Peer nodeId. */
    public nodeId: string;

    /** Peer address. */
    public address: string;

    /** Peer isPersisted. */
    public isPersisted: boolean;

    /** Peer isConnected. */
    public isConnected: boolean;

    /**
     * Creates a new Peer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Peer instance
     */
    public static create(properties?: types.IPeer): types.Peer;

    /**
     * Encodes the specified Peer message. Does not implicitly {@link types.Peer.verify|verify} messages.
     * @param message Peer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IPeer,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Peer message, length delimited. Does not implicitly {@link types.Peer.verify|verify} messages.
     * @param message Peer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IPeer,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Peer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Peer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Peer;

    /**
     * Decodes a Peer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Peer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Peer;

    /**
     * Verifies a Peer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Peer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Peer
     */
    public static fromObject(object: { [k: string]: any }): types.Peer;

    /**
     * Creates a plain object from a Peer message. Also converts values to other types if specified.
     * @param message Peer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Peer,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Peer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Peer
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GraphNode. */
  interface IGraphNode {
    /** GraphNode channels */
    channels?: (number | Long)[] | null;

    /** GraphNode announcementInfo */
    announcementInfo?: types.IGraphNodeAnnouncement | null;
  }

  /** Represents a GraphNode. */
  class GraphNode implements IGraphNode {
    /**
     * Constructs a new GraphNode.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IGraphNode);

    /** GraphNode channels. */
    public channels: (number | Long)[];

    /** GraphNode announcementInfo. */
    public announcementInfo?: types.IGraphNodeAnnouncement | null;

    /**
     * Creates a new GraphNode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GraphNode instance
     */
    public static create(properties?: types.IGraphNode): types.GraphNode;

    /**
     * Encodes the specified GraphNode message. Does not implicitly {@link types.GraphNode.verify|verify} messages.
     * @param message GraphNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IGraphNode,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified GraphNode message, length delimited. Does not implicitly {@link types.GraphNode.verify|verify} messages.
     * @param message GraphNode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IGraphNode,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a GraphNode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GraphNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.GraphNode;

    /**
     * Decodes a GraphNode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GraphNode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.GraphNode;

    /**
     * Verifies a GraphNode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GraphNode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GraphNode
     */
    public static fromObject(object: { [k: string]: any }): types.GraphNode;

    /**
     * Creates a plain object from a GraphNode message. Also converts values to other types if specified.
     * @param message GraphNode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.GraphNode,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this GraphNode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GraphNode
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11RouteHint. */
  interface IBolt11RouteHint {
    /** Bolt11RouteHint hopHints */
    hopHints?: types.IBolt11HopHint[] | null;
  }

  /** Represents a Bolt11RouteHint. */
  class Bolt11RouteHint implements IBolt11RouteHint {
    /**
     * Constructs a new Bolt11RouteHint.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11RouteHint);

    /** Bolt11RouteHint hopHints. */
    public hopHints: types.IBolt11HopHint[];

    /**
     * Creates a new Bolt11RouteHint instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11RouteHint instance
     */
    public static create(
      properties?: types.IBolt11RouteHint
    ): types.Bolt11RouteHint;

    /**
     * Encodes the specified Bolt11RouteHint message. Does not implicitly {@link types.Bolt11RouteHint.verify|verify} messages.
     * @param message Bolt11RouteHint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11RouteHint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11RouteHint message, length delimited. Does not implicitly {@link types.Bolt11RouteHint.verify|verify} messages.
     * @param message Bolt11RouteHint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11RouteHint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11RouteHint message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11RouteHint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11RouteHint;

    /**
     * Decodes a Bolt11RouteHint message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11RouteHint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11RouteHint;

    /**
     * Verifies a Bolt11RouteHint message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11RouteHint message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11RouteHint
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.Bolt11RouteHint;

    /**
     * Creates a plain object from a Bolt11RouteHint message. Also converts values to other types if specified.
     * @param message Bolt11RouteHint
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11RouteHint,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11RouteHint to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11RouteHint
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11HopHint. */
  interface IBolt11HopHint {
    /** Bolt11HopHint nodeId */
    nodeId?: string | null;

    /** Bolt11HopHint shortChannelId */
    shortChannelId?: number | Long | null;

    /** Bolt11HopHint feeBaseMsat */
    feeBaseMsat?: number | null;

    /** Bolt11HopHint feeProportionalMillionths */
    feeProportionalMillionths?: number | null;

    /** Bolt11HopHint cltvExpiryDelta */
    cltvExpiryDelta?: number | null;
  }

  /** Represents a Bolt11HopHint. */
  class Bolt11HopHint implements IBolt11HopHint {
    /**
     * Constructs a new Bolt11HopHint.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11HopHint);

    /** Bolt11HopHint nodeId. */
    public nodeId: string;

    /** Bolt11HopHint shortChannelId. */
    public shortChannelId: number | Long;

    /** Bolt11HopHint feeBaseMsat. */
    public feeBaseMsat: number;

    /** Bolt11HopHint feeProportionalMillionths. */
    public feeProportionalMillionths: number;

    /** Bolt11HopHint cltvExpiryDelta. */
    public cltvExpiryDelta: number;

    /**
     * Creates a new Bolt11HopHint instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11HopHint instance
     */
    public static create(
      properties?: types.IBolt11HopHint
    ): types.Bolt11HopHint;

    /**
     * Encodes the specified Bolt11HopHint message. Does not implicitly {@link types.Bolt11HopHint.verify|verify} messages.
     * @param message Bolt11HopHint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11HopHint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11HopHint message, length delimited. Does not implicitly {@link types.Bolt11HopHint.verify|verify} messages.
     * @param message Bolt11HopHint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11HopHint,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11HopHint message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11HopHint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11HopHint;

    /**
     * Decodes a Bolt11HopHint message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11HopHint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11HopHint;

    /**
     * Verifies a Bolt11HopHint message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11HopHint message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11HopHint
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt11HopHint;

    /**
     * Creates a plain object from a Bolt11HopHint message. Also converts values to other types if specified.
     * @param message Bolt11HopHint
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11HopHint,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11HopHint to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11HopHint
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OfferAmount. */
  interface IOfferAmount {
    /** OfferAmount bitcoinAmountMsats */
    bitcoinAmountMsats?: number | Long | null;

    /** OfferAmount currencyAmount */
    currencyAmount?: types.ICurrencyAmount | null;
  }

  /** Represents an OfferAmount. */
  class OfferAmount implements IOfferAmount {
    /**
     * Constructs a new OfferAmount.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IOfferAmount);

    /** OfferAmount bitcoinAmountMsats. */
    public bitcoinAmountMsats?: number | Long | null;

    /** OfferAmount currencyAmount. */
    public currencyAmount?: types.ICurrencyAmount | null;

    /** OfferAmount amount. */
    public amount?: 'bitcoinAmountMsats' | 'currencyAmount';

    /**
     * Creates a new OfferAmount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OfferAmount instance
     */
    public static create(properties?: types.IOfferAmount): types.OfferAmount;

    /**
     * Encodes the specified OfferAmount message. Does not implicitly {@link types.OfferAmount.verify|verify} messages.
     * @param message OfferAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IOfferAmount,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OfferAmount message, length delimited. Does not implicitly {@link types.OfferAmount.verify|verify} messages.
     * @param message OfferAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IOfferAmount,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OfferAmount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OfferAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.OfferAmount;

    /**
     * Decodes an OfferAmount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OfferAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.OfferAmount;

    /**
     * Verifies an OfferAmount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OfferAmount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OfferAmount
     */
    public static fromObject(object: { [k: string]: any }): types.OfferAmount;

    /**
     * Creates a plain object from an OfferAmount message. Also converts values to other types if specified.
     * @param message OfferAmount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.OfferAmount,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OfferAmount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OfferAmount
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CurrencyAmount. */
  interface ICurrencyAmount {
    /** CurrencyAmount iso4217Code */
    iso4217Code?: string | null;

    /** CurrencyAmount amount */
    amount?: number | Long | null;
  }

  /** Represents a CurrencyAmount. */
  class CurrencyAmount implements ICurrencyAmount {
    /**
     * Constructs a new CurrencyAmount.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.ICurrencyAmount);

    /** CurrencyAmount iso4217Code. */
    public iso4217Code: string;

    /** CurrencyAmount amount. */
    public amount: number | Long;

    /**
     * Creates a new CurrencyAmount instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CurrencyAmount instance
     */
    public static create(
      properties?: types.ICurrencyAmount
    ): types.CurrencyAmount;

    /**
     * Encodes the specified CurrencyAmount message. Does not implicitly {@link types.CurrencyAmount.verify|verify} messages.
     * @param message CurrencyAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.ICurrencyAmount,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified CurrencyAmount message, length delimited. Does not implicitly {@link types.CurrencyAmount.verify|verify} messages.
     * @param message CurrencyAmount message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.ICurrencyAmount,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a CurrencyAmount message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CurrencyAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.CurrencyAmount;

    /**
     * Decodes a CurrencyAmount message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CurrencyAmount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.CurrencyAmount;

    /**
     * Verifies a CurrencyAmount message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CurrencyAmount message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CurrencyAmount
     */
    public static fromObject(object: {
      [k: string]: any;
    }): types.CurrencyAmount;

    /**
     * Creates a plain object from a CurrencyAmount message. Also converts values to other types if specified.
     * @param message CurrencyAmount
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.CurrencyAmount,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this CurrencyAmount to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CurrencyAmount
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OfferQuantity. */
  interface IOfferQuantity {
    /** OfferQuantity one */
    one?: boolean | null;

    /** OfferQuantity bounded */
    bounded?: number | Long | null;

    /** OfferQuantity unbounded */
    unbounded?: boolean | null;
  }

  /** Represents an OfferQuantity. */
  class OfferQuantity implements IOfferQuantity {
    /**
     * Constructs a new OfferQuantity.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IOfferQuantity);

    /** OfferQuantity one. */
    public one?: boolean | null;

    /** OfferQuantity bounded. */
    public bounded?: number | Long | null;

    /** OfferQuantity unbounded. */
    public unbounded?: boolean | null;

    /** OfferQuantity quantity. */
    public quantity?: 'one' | 'bounded' | 'unbounded';

    /**
     * Creates a new OfferQuantity instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OfferQuantity instance
     */
    public static create(
      properties?: types.IOfferQuantity
    ): types.OfferQuantity;

    /**
     * Encodes the specified OfferQuantity message. Does not implicitly {@link types.OfferQuantity.verify|verify} messages.
     * @param message OfferQuantity message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IOfferQuantity,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified OfferQuantity message, length delimited. Does not implicitly {@link types.OfferQuantity.verify|verify} messages.
     * @param message OfferQuantity message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IOfferQuantity,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an OfferQuantity message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OfferQuantity
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.OfferQuantity;

    /**
     * Decodes an OfferQuantity message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OfferQuantity
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.OfferQuantity;

    /**
     * Verifies an OfferQuantity message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OfferQuantity message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OfferQuantity
     */
    public static fromObject(object: { [k: string]: any }): types.OfferQuantity;

    /**
     * Creates a plain object from an OfferQuantity message. Also converts values to other types if specified.
     * @param message OfferQuantity
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.OfferQuantity,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this OfferQuantity to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OfferQuantity
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a BlindedPath. */
  interface IBlindedPath {
    /** BlindedPath introductionNodeId */
    introductionNodeId?: string | null;

    /** BlindedPath blindingPoint */
    blindingPoint?: string | null;

    /** BlindedPath numHops */
    numHops?: number | null;

    /** BlindedPath introductionScid */
    introductionScid?: number | Long | null;
  }

  /** Represents a BlindedPath. */
  class BlindedPath implements IBlindedPath {
    /**
     * Constructs a new BlindedPath.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBlindedPath);

    /** BlindedPath introductionNodeId. */
    public introductionNodeId?: string | null;

    /** BlindedPath blindingPoint. */
    public blindingPoint: string;

    /** BlindedPath numHops. */
    public numHops: number;

    /** BlindedPath introductionScid. */
    public introductionScid?: number | Long | null;

    /**
     * Creates a new BlindedPath instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BlindedPath instance
     */
    public static create(properties?: types.IBlindedPath): types.BlindedPath;

    /**
     * Encodes the specified BlindedPath message. Does not implicitly {@link types.BlindedPath.verify|verify} messages.
     * @param message BlindedPath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBlindedPath,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified BlindedPath message, length delimited. Does not implicitly {@link types.BlindedPath.verify|verify} messages.
     * @param message BlindedPath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBlindedPath,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a BlindedPath message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BlindedPath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.BlindedPath;

    /**
     * Decodes a BlindedPath message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BlindedPath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.BlindedPath;

    /**
     * Verifies a BlindedPath message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a BlindedPath message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BlindedPath
     */
    public static fromObject(object: { [k: string]: any }): types.BlindedPath;

    /**
     * Creates a plain object from a BlindedPath message. Also converts values to other types if specified.
     * @param message BlindedPath
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.BlindedPath,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this BlindedPath to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BlindedPath
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Bolt11Feature. */
  interface IBolt11Feature {
    /** Bolt11Feature name */
    name?: string | null;

    /** Bolt11Feature isRequired */
    isRequired?: boolean | null;

    /** Bolt11Feature isKnown */
    isKnown?: boolean | null;
  }

  /** Represents a Bolt11Feature. */
  class Bolt11Feature implements IBolt11Feature {
    /**
     * Constructs a new Bolt11Feature.
     * @param [properties] Properties to set
     */
    constructor(properties?: types.IBolt11Feature);

    /** Bolt11Feature name. */
    public name: string;

    /** Bolt11Feature isRequired. */
    public isRequired: boolean;

    /** Bolt11Feature isKnown. */
    public isKnown: boolean;

    /**
     * Creates a new Bolt11Feature instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Bolt11Feature instance
     */
    public static create(
      properties?: types.IBolt11Feature
    ): types.Bolt11Feature;

    /**
     * Encodes the specified Bolt11Feature message. Does not implicitly {@link types.Bolt11Feature.verify|verify} messages.
     * @param message Bolt11Feature message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: types.IBolt11Feature,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified Bolt11Feature message, length delimited. Does not implicitly {@link types.Bolt11Feature.verify|verify} messages.
     * @param message Bolt11Feature message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: types.IBolt11Feature,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a Bolt11Feature message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Bolt11Feature
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): types.Bolt11Feature;

    /**
     * Decodes a Bolt11Feature message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Bolt11Feature
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): types.Bolt11Feature;

    /**
     * Verifies a Bolt11Feature message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Bolt11Feature message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Bolt11Feature
     */
    public static fromObject(object: { [k: string]: any }): types.Bolt11Feature;

    /**
     * Creates a plain object from a Bolt11Feature message. Also converts values to other types if specified.
     * @param message Bolt11Feature
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: types.Bolt11Feature,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this Bolt11Feature to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Bolt11Feature
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace error. */
export namespace error {
  /** Properties of an ErrorResponse. */
  interface IErrorResponse {
    /** ErrorResponse message */
    message?: string | null;

    /** ErrorResponse errorCode */
    errorCode?: error.ErrorCode | null;
  }

  /** Represents an ErrorResponse. */
  class ErrorResponse implements IErrorResponse {
    /**
     * Constructs a new ErrorResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: error.IErrorResponse);

    /** ErrorResponse message. */
    public message: string;

    /** ErrorResponse errorCode. */
    public errorCode: error.ErrorCode;

    /**
     * Creates a new ErrorResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ErrorResponse instance
     */
    public static create(
      properties?: error.IErrorResponse
    ): error.ErrorResponse;

    /**
     * Encodes the specified ErrorResponse message. Does not implicitly {@link error.ErrorResponse.verify|verify} messages.
     * @param message ErrorResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: error.IErrorResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified ErrorResponse message, length delimited. Does not implicitly {@link error.ErrorResponse.verify|verify} messages.
     * @param message ErrorResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: error.IErrorResponse,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an ErrorResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ErrorResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): error.ErrorResponse;

    /**
     * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ErrorResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): error.ErrorResponse;

    /**
     * Verifies an ErrorResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ErrorResponse
     */
    public static fromObject(object: { [k: string]: any }): error.ErrorResponse;

    /**
     * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
     * @param message ErrorResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: error.ErrorResponse,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this ErrorResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ErrorResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** ErrorCode enum. */
  enum ErrorCode {
    UNKNOWN_ERROR = 0,
    INVALID_REQUEST_ERROR = 1,
    AUTH_ERROR = 2,
    LIGHTNING_ERROR = 3,
    INTERNAL_SERVER_ERROR = 4,
  }
}

/** Namespace events. */
export namespace events {
  /** Properties of an EventEnvelope. */
  interface IEventEnvelope {
    /** EventEnvelope paymentReceived */
    paymentReceived?: events.IPaymentReceived | null;

    /** EventEnvelope paymentSuccessful */
    paymentSuccessful?: events.IPaymentSuccessful | null;

    /** EventEnvelope paymentFailed */
    paymentFailed?: events.IPaymentFailed | null;

    /** EventEnvelope paymentForwarded */
    paymentForwarded?: events.IPaymentForwarded | null;

    /** EventEnvelope paymentClaimable */
    paymentClaimable?: events.IPaymentClaimable | null;
  }

  /** Represents an EventEnvelope. */
  class EventEnvelope implements IEventEnvelope {
    /**
     * Constructs a new EventEnvelope.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IEventEnvelope);

    /** EventEnvelope paymentReceived. */
    public paymentReceived?: events.IPaymentReceived | null;

    /** EventEnvelope paymentSuccessful. */
    public paymentSuccessful?: events.IPaymentSuccessful | null;

    /** EventEnvelope paymentFailed. */
    public paymentFailed?: events.IPaymentFailed | null;

    /** EventEnvelope paymentForwarded. */
    public paymentForwarded?: events.IPaymentForwarded | null;

    /** EventEnvelope paymentClaimable. */
    public paymentClaimable?: events.IPaymentClaimable | null;

    /** EventEnvelope event. */
    public event?:
      | 'paymentReceived'
      | 'paymentSuccessful'
      | 'paymentFailed'
      | 'paymentForwarded'
      | 'paymentClaimable';

    /**
     * Creates a new EventEnvelope instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EventEnvelope instance
     */
    public static create(
      properties?: events.IEventEnvelope
    ): events.EventEnvelope;

    /**
     * Encodes the specified EventEnvelope message. Does not implicitly {@link events.EventEnvelope.verify|verify} messages.
     * @param message EventEnvelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IEventEnvelope,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link events.EventEnvelope.verify|verify} messages.
     * @param message EventEnvelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IEventEnvelope,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes an EventEnvelope message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EventEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.EventEnvelope;

    /**
     * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EventEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.EventEnvelope;

    /**
     * Verifies an EventEnvelope message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EventEnvelope
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.EventEnvelope;

    /**
     * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
     * @param message EventEnvelope
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.EventEnvelope,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this EventEnvelope to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EventEnvelope
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentReceived. */
  interface IPaymentReceived {
    /** PaymentReceived payment */
    payment?: types.IPayment | null;
  }

  /** Represents a PaymentReceived. */
  class PaymentReceived implements IPaymentReceived {
    /**
     * Constructs a new PaymentReceived.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IPaymentReceived);

    /** PaymentReceived payment. */
    public payment?: types.IPayment | null;

    /**
     * Creates a new PaymentReceived instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentReceived instance
     */
    public static create(
      properties?: events.IPaymentReceived
    ): events.PaymentReceived;

    /**
     * Encodes the specified PaymentReceived message. Does not implicitly {@link events.PaymentReceived.verify|verify} messages.
     * @param message PaymentReceived message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IPaymentReceived,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentReceived message, length delimited. Does not implicitly {@link events.PaymentReceived.verify|verify} messages.
     * @param message PaymentReceived message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IPaymentReceived,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentReceived message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentReceived
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.PaymentReceived;

    /**
     * Decodes a PaymentReceived message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentReceived
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.PaymentReceived;

    /**
     * Verifies a PaymentReceived message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentReceived message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentReceived
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.PaymentReceived;

    /**
     * Creates a plain object from a PaymentReceived message. Also converts values to other types if specified.
     * @param message PaymentReceived
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.PaymentReceived,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentReceived to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentReceived
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentSuccessful. */
  interface IPaymentSuccessful {
    /** PaymentSuccessful payment */
    payment?: types.IPayment | null;
  }

  /** Represents a PaymentSuccessful. */
  class PaymentSuccessful implements IPaymentSuccessful {
    /**
     * Constructs a new PaymentSuccessful.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IPaymentSuccessful);

    /** PaymentSuccessful payment. */
    public payment?: types.IPayment | null;

    /**
     * Creates a new PaymentSuccessful instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentSuccessful instance
     */
    public static create(
      properties?: events.IPaymentSuccessful
    ): events.PaymentSuccessful;

    /**
     * Encodes the specified PaymentSuccessful message. Does not implicitly {@link events.PaymentSuccessful.verify|verify} messages.
     * @param message PaymentSuccessful message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IPaymentSuccessful,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentSuccessful message, length delimited. Does not implicitly {@link events.PaymentSuccessful.verify|verify} messages.
     * @param message PaymentSuccessful message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IPaymentSuccessful,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentSuccessful message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentSuccessful
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.PaymentSuccessful;

    /**
     * Decodes a PaymentSuccessful message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentSuccessful
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.PaymentSuccessful;

    /**
     * Verifies a PaymentSuccessful message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentSuccessful message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentSuccessful
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.PaymentSuccessful;

    /**
     * Creates a plain object from a PaymentSuccessful message. Also converts values to other types if specified.
     * @param message PaymentSuccessful
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.PaymentSuccessful,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentSuccessful to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentSuccessful
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentFailed. */
  interface IPaymentFailed {
    /** PaymentFailed payment */
    payment?: types.IPayment | null;
  }

  /** Represents a PaymentFailed. */
  class PaymentFailed implements IPaymentFailed {
    /**
     * Constructs a new PaymentFailed.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IPaymentFailed);

    /** PaymentFailed payment. */
    public payment?: types.IPayment | null;

    /**
     * Creates a new PaymentFailed instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentFailed instance
     */
    public static create(
      properties?: events.IPaymentFailed
    ): events.PaymentFailed;

    /**
     * Encodes the specified PaymentFailed message. Does not implicitly {@link events.PaymentFailed.verify|verify} messages.
     * @param message PaymentFailed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IPaymentFailed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentFailed message, length delimited. Does not implicitly {@link events.PaymentFailed.verify|verify} messages.
     * @param message PaymentFailed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IPaymentFailed,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentFailed message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.PaymentFailed;

    /**
     * Decodes a PaymentFailed message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.PaymentFailed;

    /**
     * Verifies a PaymentFailed message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentFailed message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentFailed
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.PaymentFailed;

    /**
     * Creates a plain object from a PaymentFailed message. Also converts values to other types if specified.
     * @param message PaymentFailed
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.PaymentFailed,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentFailed to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentFailed
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentClaimable. */
  interface IPaymentClaimable {
    /** PaymentClaimable payment */
    payment?: types.IPayment | null;
  }

  /** Represents a PaymentClaimable. */
  class PaymentClaimable implements IPaymentClaimable {
    /**
     * Constructs a new PaymentClaimable.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IPaymentClaimable);

    /** PaymentClaimable payment. */
    public payment?: types.IPayment | null;

    /**
     * Creates a new PaymentClaimable instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentClaimable instance
     */
    public static create(
      properties?: events.IPaymentClaimable
    ): events.PaymentClaimable;

    /**
     * Encodes the specified PaymentClaimable message. Does not implicitly {@link events.PaymentClaimable.verify|verify} messages.
     * @param message PaymentClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IPaymentClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentClaimable message, length delimited. Does not implicitly {@link events.PaymentClaimable.verify|verify} messages.
     * @param message PaymentClaimable message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IPaymentClaimable,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentClaimable message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.PaymentClaimable;

    /**
     * Decodes a PaymentClaimable message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentClaimable
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.PaymentClaimable;

    /**
     * Verifies a PaymentClaimable message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentClaimable message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentClaimable
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.PaymentClaimable;

    /**
     * Creates a plain object from a PaymentClaimable message. Also converts values to other types if specified.
     * @param message PaymentClaimable
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.PaymentClaimable,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentClaimable to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentClaimable
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PaymentForwarded. */
  interface IPaymentForwarded {
    /** PaymentForwarded forwardedPayment */
    forwardedPayment?: types.IForwardedPayment | null;
  }

  /** Represents a PaymentForwarded. */
  class PaymentForwarded implements IPaymentForwarded {
    /**
     * Constructs a new PaymentForwarded.
     * @param [properties] Properties to set
     */
    constructor(properties?: events.IPaymentForwarded);

    /** PaymentForwarded forwardedPayment. */
    public forwardedPayment?: types.IForwardedPayment | null;

    /**
     * Creates a new PaymentForwarded instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PaymentForwarded instance
     */
    public static create(
      properties?: events.IPaymentForwarded
    ): events.PaymentForwarded;

    /**
     * Encodes the specified PaymentForwarded message. Does not implicitly {@link events.PaymentForwarded.verify|verify} messages.
     * @param message PaymentForwarded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: events.IPaymentForwarded,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Encodes the specified PaymentForwarded message, length delimited. Does not implicitly {@link events.PaymentForwarded.verify|verify} messages.
     * @param message PaymentForwarded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: events.IPaymentForwarded,
      writer?: $protobuf.Writer
    ): $protobuf.Writer;

    /**
     * Decodes a PaymentForwarded message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PaymentForwarded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): events.PaymentForwarded;

    /**
     * Decodes a PaymentForwarded message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PaymentForwarded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): events.PaymentForwarded;

    /**
     * Verifies a PaymentForwarded message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PaymentForwarded message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PaymentForwarded
     */
    public static fromObject(object: {
      [k: string]: any;
    }): events.PaymentForwarded;

    /**
     * Creates a plain object from a PaymentForwarded message. Also converts values to other types if specified.
     * @param message PaymentForwarded
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: events.PaymentForwarded,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any };

    /**
     * Converts this PaymentForwarded to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PaymentForwarded
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
