/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import EventEmitter from 'events';
import {
  Capability,
  LightningProvider,
  GetChannelsOptions,
  GetForwardsOptions,
  GetPaymentsOptions,
  GetInvoicesOptions,
  CloseChannelOptions,
  OpenChannelOptions,
  PayOptions,
  CreateInvoiceOptions,
  PayViaPaymentDetailsOptions,
  SendToChainAddressOptions,
  CreateChainAddressFormat,
  UpdateRoutingFeesOptions,
  VerifyBackupsOptions,
  GrantAccessOptions,
  DiffieHellmanComputeSecretOptions,
} from '../lightning.types';
import {
  LdkServerClient,
  createLdkServerClient,
  Endpoints,
  toNumber,
  msatToSat,
} from './ldk-server.helpers';
import { api, types } from './proto/ldk-server';

const NOT_SUPPORTED = 'Not supported by ldk-server';

@Injectable()
export class LdkServerService implements LightningProvider {
  getCapabilities(): Set<Capability> {
    return new Set([
      Capability.WALLET_INFO,
      Capability.CHANNELS,
      Capability.CHAIN,
      Capability.PAYMENTS,
      Capability.INVOICES,
      Capability.PEERS,
      Capability.FORWARDS,
      Capability.SIGN_MESSAGE,
      Capability.NETWORK_INFO,
      Capability.ROUTING_FEES,
    ]);
  }

  connect(config: {
    socket: string;
    cert?: string;
    macaroon?: string;
    authToken?: string;
    tlsCertPath?: string;
  }): LdkServerClient {
    return createLdkServerClient(config);
  }

  // ── Wallet ──

  async getWalletInfo(connection: LdkServerClient) {
    const [nodeInfo, channels, peers] = await Promise.all([
      connection.request(
        Endpoints.GET_NODE_INFO,
        api.GetNodeInfoRequest,
        api.GetNodeInfoResponse,
        {}
      ),
      connection
        .request(
          Endpoints.LIST_CHANNELS,
          api.ListChannelsRequest,
          api.ListChannelsResponse,
          {}
        )
        .catch(() => ({ channels: [] })),
      connection
        .request(
          Endpoints.LIST_PEERS,
          api.ListPeersRequest,
          api.ListPeersResponse,
          {}
        )
        .catch(() => ({ peers: [] })),
    ]);

    const activeChannels = (channels.channels || []).filter(
      (c: types.IChannel) => c.isUsable
    );

    const isSynced =
      nodeInfo.latestLightningWalletSyncTimestamp != null &&
      nodeInfo.latestOnchainWalletSyncTimestamp != null;

    return {
      public_key: nodeInfo.nodeId || '',
      alias: nodeInfo.nodeAlias || '',
      color: '#000000',
      chains: ['bitcoin'],
      current_block_hash: nodeInfo.currentBestBlock?.blockHash || '',
      current_block_height: nodeInfo.currentBestBlock?.height || 0,
      is_synced_to_chain: isSynced,
      is_synced_to_graph:
        nodeInfo.latestRgsSnapshotTimestamp != null || isSynced,
      latest_block_at: new Date().toISOString(),
      peers_count: (peers.peers || []).length,
      version: '1.0.0 ldk-server',
      uris: nodeInfo.nodeUris || [],
      active_channels_count: activeChannels.length,
      closed_channels_count: 0,
      pending_channels_count: 0,
    };
  }

  async getIdentity(connection: LdkServerClient) {
    const info = await connection.request(
      Endpoints.GET_NODE_INFO,
      api.GetNodeInfoRequest,
      api.GetNodeInfoResponse,
      {}
    );
    return { public_key: info.nodeId || '' };
  }

  async getWalletVersion(_connection: LdkServerClient) {
    // ldk-server has no wallet version endpoint
    return {
      build_tags: [],
      commit_hash: '',
      is_autopilotrpc_enabled: false,
      is_chainrpc_enabled: false,
      is_invoicesrpc_enabled: false,
      is_signrpc_enabled: false,
      is_walletrpc_enabled: false,
      is_watchtowerrpc_enabled: false,
      is_wtclientrpc_enabled: false,
    };
  }

  async getHeight(connection: LdkServerClient) {
    const info = await connection.request(
      Endpoints.GET_NODE_INFO,
      api.GetNodeInfoRequest,
      api.GetNodeInfoResponse,
      {}
    );
    return {
      current_block_hash: info.currentBestBlock?.blockHash || '',
      current_block_height: info.currentBestBlock?.height || 0,
    };
  }

  // ── Channels ──

  async getChannels(connection: LdkServerClient, options?: GetChannelsOptions) {
    const resp = await connection.request(
      Endpoints.LIST_CHANNELS,
      api.ListChannelsRequest,
      api.ListChannelsResponse,
      {}
    );

    let channels = (resp.channels || []).map(mapChannel);

    if (options?.is_active !== undefined) {
      channels = channels.filter(c => c.is_active === options.is_active);
    }
    if (options?.is_private !== undefined) {
      channels = channels.filter(c => c.is_private === options.is_private);
    }
    if (options?.is_public !== undefined) {
      channels = channels.filter(c => !c.is_private === options.is_public);
    }
    if (options?.partner_public_key) {
      channels = channels.filter(
        c => c.partner_public_key === options.partner_public_key
      );
    }

    return { channels };
  }

  async getClosedChannels(_connection: LdkServerClient) {
    // ldk-server doesn't track closed channel history
    return { channels: [] };
  }

  async getPendingChannels(connection: LdkServerClient) {
    const resp = await connection.request(
      Endpoints.LIST_CHANNELS,
      api.ListChannelsRequest,
      api.ListChannelsResponse,
      {}
    );

    const pending = (resp.channels || [])
      .filter((c: types.IChannel) => !c.isChannelReady)
      .map(ch => ({
        partner_public_key: ch.counterpartyNodeId || '',
        local_balance: msatToSat(ch.outboundCapacityMsat),
        remote_balance: msatToSat(ch.inboundCapacityMsat),
        local_reserve: toNumber(ch.unspendablePunishmentReserve),
        remote_reserve: toNumber(ch.counterpartyUnspendablePunishmentReserve),
        transaction_id: ch.fundingTxo?.txid || '',
        transaction_vout: ch.fundingTxo?.vout || 0,
        is_active: false,
        is_closing: false,
        is_opening: true,
        is_timelocked: false,
        received: 0,
        sent: 0,
        transaction_fee: 0,
      }));

    return { pending_channels: pending };
  }

  async getChannel(connection: LdkServerClient, id: string) {
    // First try to find it in our local channels (for fee policy editing)
    const channelsResp = await connection.request(
      Endpoints.LIST_CHANNELS,
      api.ListChannelsRequest,
      api.ListChannelsResponse,
      {}
    );

    const nodeInfo = await connection.request(
      Endpoints.GET_NODE_INFO,
      api.GetNodeInfoRequest,
      api.GetNodeInfoResponse,
      {}
    );

    const localChannel = (channelsResp.channels || []).find(
      (c: types.IChannel) => c.channelId === id
    );

    if (localChannel) {
      const config = localChannel.channelConfig;
      const myKey = nodeInfo.nodeId || '';
      const partnerKey = localChannel.counterpartyNodeId || '';

      return {
        capacity: toNumber(localChannel.channelValueSats),
        id,
        policies: [
          {
            public_key: myKey,
            base_fee_mtokens: toNumber(
              config?.forwardingFeeBaseMsat
            ).toString(),
            cltv_delta: config?.cltvExpiryDelta || 0,
            fee_rate: toNumber(config?.forwardingFeeProportionalMillionths),
            is_disabled: !localChannel.isUsable,
            max_htlc_mtokens: toNumber(
              localChannel.nextOutboundHtlcLimitMsat
            ).toString(),
            min_htlc_mtokens: toNumber(
              localChannel.nextOutboundHtlcMinimumMsat
            ).toString(),
            updated_at: '',
          },
          {
            public_key: partnerKey,
            base_fee_mtokens: toNumber(
              localChannel.counterpartyForwardingInfoFeeBaseMsat
            ).toString(),
            cltv_delta:
              localChannel.counterpartyForwardingInfoCltvExpiryDelta || 0,
            fee_rate: toNumber(
              localChannel.counterpartyForwardingInfoFeeProportionalMillionths
            ),
            is_disabled: !localChannel.isUsable,
            max_htlc_mtokens: toNumber(
              localChannel.counterpartyOutboundHtlcMaximumMsat
            ).toString(),
            min_htlc_mtokens: toNumber(
              localChannel.counterpartyOutboundHtlcMinimumMsat
            ).toString(),
            updated_at: '',
          },
        ],
        transaction_id: localChannel.fundingTxo?.txid || '',
        transaction_vout: localChannel.fundingTxo?.vout || 0,
        updated_at: '',
      };
    }

    // Fall back to network graph for numeric short channel IDs
    try {
      const scid = parseInt(id);
      if (!isNaN(scid)) {
        const resp = await connection.request(
          Endpoints.GRAPH_GET_CHANNEL,
          api.GraphGetChannelRequest,
          api.GraphGetChannelResponse,
          { shortChannelId: scid }
        );
        const ch = resp.channel;
        if (ch) {
          return {
            capacity: toNumber(ch.capacitySats),
            id,
            policies: [
              mapGraphChannelUpdate(ch.oneToTwo, ch.nodeOne || ''),
              mapGraphChannelUpdate(ch.twoToOne, ch.nodeTwo || ''),
            ],
            transaction_id: '',
            transaction_vout: 0,
            updated_at: '',
          };
        }
      }
    } catch {
      // Fall through
    }
    throw new Error(`Channel ${id} not found`);
  }

  async openChannel(connection: LdkServerClient, options: OpenChannelOptions) {
    // ldk-server requires a peer address. We'll try to connect first using
    // the partner's known address, then open channel.
    const peers = await connection
      .request(
        Endpoints.LIST_PEERS,
        api.ListPeersRequest,
        api.ListPeersResponse,
        {}
      )
      .catch(() => ({ peers: [] }));

    const existingPeer = (peers.peers || []).find(
      (p: types.IPeer) => p.nodeId === options.partner_public_key
    );

    const address = existingPeer?.address || '';

    const resp = await connection.request(
      Endpoints.OPEN_CHANNEL,
      api.OpenChannelRequest,
      api.OpenChannelResponse,
      {
        nodePubkey: options.partner_public_key,
        address,
        channelAmountSats: options.local_tokens,
        pushToCounterpartyMsat: options.give_tokens
          ? options.give_tokens * 1000
          : undefined,
        announceChannel: !options.is_private,
      }
    );

    return {
      transaction_id: resp.userChannelId || '',
      transaction_vout: 0,
    };
  }

  async closeChannel(
    connection: LdkServerClient,
    options: CloseChannelOptions
  ) {
    // ldk-server uses user_channel_id + counterparty_node_id for close.
    // ThunderHub passes transaction_id+vout or channel id.
    // We need to find the channel first to get the counterparty.
    const channelsResp = await connection.request(
      Endpoints.LIST_CHANNELS,
      api.ListChannelsRequest,
      api.ListChannelsResponse,
      {}
    );

    const channel = (channelsResp.channels || []).find(
      (c: types.IChannel) =>
        c.userChannelId === options.id ||
        c.channelId === options.id ||
        (options.transaction_id &&
          c.fundingTxo?.txid === options.transaction_id &&
          (options.transaction_vout === undefined ||
            c.fundingTxo?.vout === options.transaction_vout))
    );

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (options.is_force_close) {
      await connection.request(
        Endpoints.FORCE_CLOSE_CHANNEL,
        api.ForceCloseChannelRequest,
        api.ForceCloseChannelResponse,
        {
          userChannelId: channel.userChannelId,
          counterpartyNodeId: channel.counterpartyNodeId,
        }
      );
    } else {
      await connection.request(
        Endpoints.CLOSE_CHANNEL,
        api.CloseChannelRequest,
        api.CloseChannelResponse,
        {
          userChannelId: channel.userChannelId,
          counterpartyNodeId: channel.counterpartyNodeId,
        }
      );
    }

    return {
      transaction_id: channel.fundingTxo?.txid || '',
      transaction_vout: channel.fundingTxo?.vout || 0,
    };
  }

  async getChannelBalance(connection: LdkServerClient) {
    const balances = await connection.request(
      Endpoints.GET_BALANCES,
      api.GetBalancesRequest,
      api.GetBalancesResponse,
      {}
    );
    return {
      channel_balance: toNumber(balances.totalLightningBalanceSats),
      pending_balance: 0,
    };
  }

  // ── Chain ──

  async getChainBalance(connection: LdkServerClient) {
    const balances = await connection.request(
      Endpoints.GET_BALANCES,
      api.GetBalancesRequest,
      api.GetBalancesResponse,
      {}
    );
    return {
      chain_balance: toNumber(balances.spendableOnchainBalanceSats),
    };
  }

  async getPendingChainBalance(connection: LdkServerClient) {
    const balances = await connection.request(
      Endpoints.GET_BALANCES,
      api.GetBalancesRequest,
      api.GetBalancesResponse,
      {}
    );
    const total = toNumber(balances.totalOnchainBalanceSats);
    const spendable = toNumber(balances.spendableOnchainBalanceSats);
    const anchorReserve = toNumber(balances.totalAnchorChannelsReserveSats);

    // Sum up funds being swept from closed channels
    const pendingSweep = (
      balances.pendingBalancesFromChannelClosures || []
    ).reduce((sum, b) => {
      if (b.pendingBroadcast) {
        return sum + toNumber(b.pendingBroadcast.amountSatoshis);
      }
      if (b.broadcastAwaitingConfirmation) {
        return sum + toNumber(b.broadcastAwaitingConfirmation.amountSatoshis);
      }
      if (b.awaitingThresholdConfirmations) {
        return sum + toNumber(b.awaitingThresholdConfirmations.amountSatoshis);
      }
      return sum;
    }, 0);

    // Sum up lightning balances that are pending on-chain settlement
    const pendingLightning = (balances.lightningBalances || []).reduce(
      (sum, b) => {
        if (b.claimableAwaitingConfirmations) {
          return (
            sum + toNumber(b.claimableAwaitingConfirmations.amountSatoshis)
          );
        }
        if (b.contentiousClaimable) {
          return sum + toNumber(b.contentiousClaimable.amountSatoshis);
        }
        if (b.counterpartyRevokedOutputClaimable) {
          return (
            sum + toNumber(b.counterpartyRevokedOutputClaimable.amountSatoshis)
          );
        }
        return sum;
      },
      0
    );

    const unconfirmed = Math.max(0, total - spendable - anchorReserve);

    return {
      pending_chain_balance: unconfirmed + pendingSweep + pendingLightning,
    };
  }

  async getChainTransactions(_connection: LdkServerClient) {
    // ldk-server doesn't have a dedicated chain transactions endpoint.
    // On-chain payments are included in ListPayments but with different shape.
    return { transactions: [] };
  }

  async getUtxos(_connection: LdkServerClient) {
    throw new Error(NOT_SUPPORTED);
  }

  async createChainAddress(
    connection: LdkServerClient,
    _is_unused: boolean,
    _format: CreateChainAddressFormat
  ) {
    const resp = await connection.request(
      Endpoints.ONCHAIN_RECEIVE,
      api.OnchainReceiveRequest,
      api.OnchainReceiveResponse,
      {}
    );
    return { address: resp.address || '' };
  }

  async sendToChainAddress(
    connection: LdkServerClient,
    options: SendToChainAddressOptions
  ) {
    const resp = await connection.request(
      Endpoints.ONCHAIN_SEND,
      api.OnchainSendRequest,
      api.OnchainSendResponse,
      {
        address: options.address,
        amountSats: options.is_send_all ? undefined : options.tokens,
        sendAll: options.is_send_all || undefined,
        feeRateSatPerVb: options.fee_tokens_per_vbyte,
      }
    );
    return {
      confirmation_count: 0,
      id: resp.txid || '',
      is_confirmed: false,
      is_outgoing: true,
      tokens: options.tokens || 0,
    };
  }

  // ── Payments ──

  async pay(connection: LdkServerClient, options: PayOptions) {
    const resp = await connection.request(
      Endpoints.BOLT11_SEND,
      api.Bolt11SendRequest,
      api.Bolt11SendResponse,
      {
        invoice: options.request,
        amountMsat: options.tokens ? options.tokens * 1000 : undefined,
      }
    );
    return { id: resp.paymentId || '' };
  }

  async payViaPaymentDetails(
    connection: LdkServerClient,
    options: PayViaPaymentDetailsOptions
  ) {
    // Map to SpontaneousSend (keysend)
    const amountMsat = options.mtokens
      ? parseInt(options.mtokens)
      : (options.tokens || 0) * 1000;

    const resp = await connection.request(
      Endpoints.SPONTANEOUS_SEND,
      api.SpontaneousSendRequest,
      api.SpontaneousSendResponse,
      {
        amountMsat,
        nodeId: options.destination,
      }
    );

    return {
      fee: 0,
      fee_mtokens: '0',
      hops: [],
      id: resp.paymentId || '',
      is_confirmed: true,
      is_outgoing: true,
      mtokens: amountMsat.toString(),
      secret: '',
      safe_fee: 0,
      safe_tokens: options.tokens || msatToSat(amountMsat),
      tokens: options.tokens || msatToSat(amountMsat),
    };
  }

  async decodePaymentRequest(connection: LdkServerClient, request: string) {
    const resp = await connection.request(
      Endpoints.DECODE_INVOICE,
      api.DecodeInvoiceRequest,
      api.DecodeInvoiceResponse,
      { invoice: request }
    );

    const amountMsat = toNumber(resp.amountMsat);
    const timestamp = toNumber(resp.timestamp);
    const expiry = toNumber(resp.expiry);

    return {
      chain_addresses: resp.fallbackAddress ? [resp.fallbackAddress] : [],
      cltv_delta: toNumber(resp.minFinalCltvExpiryDelta),
      created_at: timestamp ? new Date(timestamp * 1000).toISOString() : '',
      description: resp.description || '',
      description_hash: resp.descriptionHash || '',
      destination: resp.destination || '',
      expires_at:
        timestamp && expiry
          ? new Date((timestamp + expiry) * 1000).toISOString()
          : '',
      id: resp.paymentHash || '',
      mtokens: amountMsat.toString(),
      payment: resp.paymentSecret || '',
      routes: (resp.routeHints || []).map(rh => ({
        hops: (rh.hopHints || []).map(h => ({
          public_key: h.nodeId || '',
          channel: toNumber(h.shortChannelId).toString(),
          base_fee_mtokens: toNumber(h.feeBaseMsat).toString(),
          fee_rate: toNumber(h.feeProportionalMillionths),
          cltv_delta: h.cltvExpiryDelta || 0,
        })),
      })),
      safe_tokens: msatToSat(amountMsat),
      tokens: msatToSat(amountMsat),
    };
  }

  async getPayments(connection: LdkServerClient, options: GetPaymentsOptions) {
    const resp = await connection.request(
      Endpoints.LIST_PAYMENTS,
      api.ListPaymentsRequest,
      api.ListPaymentsResponse,
      {
        pageToken: options.token
          ? { token: options.token, index: 0 }
          : undefined,
      }
    );

    // Filter to outbound Lightning payments (not on-chain)
    const outbound = (resp.payments || []).filter(
      (p: types.IPayment) =>
        p.direction === types.PaymentDirection.OUTBOUND &&
        p.kind?.onchain == null
    );

    const payments = outbound.map(mapPayment);

    return {
      payments,
      next: resp.nextPageToken?.token || undefined,
    };
  }

  // ── Invoices ──

  async createInvoice(
    connection: LdkServerClient,
    options: CreateInvoiceOptions
  ) {
    const resp = await connection.request(
      Endpoints.BOLT11_RECEIVE,
      api.Bolt11ReceiveRequest,
      api.Bolt11ReceiveResponse,
      {
        amountMsat: options.tokens ? options.tokens * 1000 : undefined,
        description: options.description
          ? { direct: options.description }
          : options.description_hash
            ? { hash: options.description_hash }
            : undefined,
        expirySecs: options.expires_at
          ? Math.max(
              1,
              Math.floor(
                (new Date(options.expires_at).getTime() - Date.now()) / 1000
              )
            )
          : 3600,
      }
    );

    return {
      chain_address: undefined,
      created_at: new Date().toISOString(),
      description: options.description || '',
      id: resp.paymentHash || '',
      mtokens: options.tokens ? (options.tokens * 1000).toString() : '0',
      request: resp.invoice || '',
      secret: resp.paymentSecret || '',
      tokens: options.tokens || 0,
    };
  }

  async getInvoices(connection: LdkServerClient, options: GetInvoicesOptions) {
    const resp = await connection.request(
      Endpoints.LIST_PAYMENTS,
      api.ListPaymentsRequest,
      api.ListPaymentsResponse,
      {
        pageToken: options.token
          ? { token: options.token, index: 0 }
          : undefined,
      }
    );

    // Filter to inbound payments (received invoices)
    const inbound = (resp.payments || []).filter(
      (p: types.IPayment) =>
        p.direction === types.PaymentDirection.INBOUND &&
        p.kind?.onchain == null
    );

    const invoices = inbound.map(mapInvoice);

    return {
      invoices,
      next: resp.nextPageToken?.token || undefined,
    };
  }

  subscribeToInvoice(connection: LdkServerClient, id: string): EventEmitter {
    const emitter = new EventEmitter();

    // Poll GetPaymentDetails until the invoice is paid or we give up
    const pollInterval = 2000;
    const maxAttempts = 45; // ~90 seconds total
    let attempts = 0;

    const poll = async () => {
      try {
        const resp = await connection.request(
          Endpoints.GET_PAYMENT_DETAILS,
          api.GetPaymentDetailsRequest,
          api.GetPaymentDetailsResponse,
          { paymentId: id }
        );

        const payment = resp.payment;
        if (payment?.status === types.PaymentStatus.SUCCEEDED) {
          emitter.emit('invoice_updated', {
            is_confirmed: true,
            received: msatToSat(toNumber(payment.amountMsat)),
            tokens: msatToSat(toNumber(payment.amountMsat)),
          });
          return;
        }
      } catch {
        // Payment not found yet — keep polling
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, pollInterval);
      }
    };

    poll();
    return emitter;
  }

  // ── Peers ──

  async getPeers(connection: LdkServerClient) {
    const resp = await connection.request(
      Endpoints.LIST_PEERS,
      api.ListPeersRequest,
      api.ListPeersResponse,
      {}
    );

    const peers = (resp.peers || []).map((p: types.IPeer) => ({
      bytes_received: 0,
      bytes_sent: 0,
      is_inbound: false,
      is_sync_peer: false,
      ping_time: 0,
      public_key: p.nodeId || '',
      socket: p.address || '',
      tokens_received: 0,
      tokens_sent: 0,
    }));

    return { peers };
  }

  async addPeer(
    connection: LdkServerClient,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    await connection.request(
      Endpoints.CONNECT_PEER,
      api.ConnectPeerRequest,
      api.ConnectPeerResponse,
      {
        nodePubkey: public_key,
        address: socket,
        persist: !is_temporary,
      }
    );
    return {};
  }

  async removePeer(connection: LdkServerClient, public_key: string) {
    await connection.request(
      Endpoints.DISCONNECT_PEER,
      api.DisconnectPeerRequest,
      api.DisconnectPeerResponse,
      {
        nodePubkey: public_key,
      }
    );
    return {};
  }

  // ── Forwards ──

  async getForwards(connection: LdkServerClient, options: GetForwardsOptions) {
    const resp = await connection.request(
      Endpoints.LIST_FORWARDED_PAYMENTS,
      api.ListForwardedPaymentsRequest,
      api.ListForwardedPaymentsResponse,
      {
        pageToken: options.token
          ? { token: options.token, index: 0 }
          : undefined,
      }
    );

    const forwards = (resp.forwardedPayments || []).map(
      (f: types.IForwardedPayment) => ({
        created_at: new Date().toISOString(),
        fee: msatToSat(f.totalFeeEarnedMsat),
        fee_mtokens: toNumber(f.totalFeeEarnedMsat).toString(),
        incoming_channel: f.prevChannelId || '',
        mtokens: toNumber(f.outboundAmountForwardedMsat).toString(),
        outgoing_channel: f.nextChannelId || '',
        tokens: msatToSat(f.outboundAmountForwardedMsat),
      })
    );

    return {
      forwards,
      next: resp.nextPageToken?.token || undefined,
    };
  }

  // ── Routing ──

  async updateRoutingFees(
    connection: LdkServerClient,
    options: UpdateRoutingFeesOptions
  ) {
    // ldk-server uses UpdateChannelConfig which requires user_channel_id + counterparty.
    // Find the channel by transaction_id/vout.
    const channelsResp = await connection.request(
      Endpoints.LIST_CHANNELS,
      api.ListChannelsRequest,
      api.ListChannelsResponse,
      {}
    );

    const channel = (channelsResp.channels || []).find(
      (c: types.IChannel) =>
        options.transaction_id &&
        c.fundingTxo?.txid === options.transaction_id &&
        (options.transaction_vout === undefined ||
          c.fundingTxo?.vout === options.transaction_vout)
    );

    if (!channel) {
      throw new Error('Channel not found for fee update');
    }

    const channelConfig: any = {};
    if (options.fee_rate !== undefined) {
      channelConfig.forwardingFeeProportionalMillionths = options.fee_rate;
    }
    if (options.base_fee_mtokens !== undefined) {
      channelConfig.forwardingFeeBaseMsat = parseInt(options.base_fee_mtokens);
    } else if (options.base_fee_tokens !== undefined) {
      channelConfig.forwardingFeeBaseMsat = options.base_fee_tokens * 1000;
    }
    if (options.cltv_delta !== undefined) {
      channelConfig.cltvExpiryDelta = options.cltv_delta;
    }

    await connection.request(
      Endpoints.UPDATE_CHANNEL_CONFIG,
      api.UpdateChannelConfigRequest,
      api.UpdateChannelConfigResponse,
      {
        userChannelId: channel.userChannelId,
        counterpartyNodeId: channel.counterpartyNodeId,
        channelConfig,
      }
    );

    return {};
  }

  // ── Network ──

  async getNode(
    connection: LdkServerClient,
    public_key: string,
    _is_omitting_channels = true
  ) {
    const resp = await connection.request(
      Endpoints.GRAPH_GET_NODE,
      api.GraphGetNodeRequest,
      api.GraphGetNodeResponse,
      { nodeId: public_key }
    );

    const node = resp.node;
    const announcement = node?.announcementInfo;

    return {
      alias: announcement?.alias || '',
      color: announcement?.rgb ? `#${announcement.rgb}` : '#000000',
      sockets: (announcement?.addresses || []).map((a: string) => ({
        socket: a,
        type: 'tcp',
      })),
      updated_at: announcement?.lastUpdate
        ? new Date(toNumber(announcement.lastUpdate) * 1000).toISOString()
        : '',
      channels: (node?.channels || []).map((scid: any) => ({
        id: toNumber(scid).toString(),
        capacity: 0,
        policies: [],
      })),
    };
  }

  async getNetworkInfo(_connection: LdkServerClient) {
    throw new Error(NOT_SUPPORTED);
  }

  // ── Messages ──

  async signMessage(connection: LdkServerClient, message: string) {
    const resp = await connection.request(
      Endpoints.SIGN_MESSAGE,
      api.SignMessageRequest,
      api.SignMessageResponse,
      { message: Buffer.from(message, 'utf-8') }
    );
    return { signature: resp.signature || '' };
  }

  async verifyMessage(
    connection: LdkServerClient,
    message: string,
    signature: string
  ) {
    // ldk-server's VerifySignature requires a public_key.
    // ThunderHub's interface doesn't pass it — we use our own node's pubkey.
    const identity = await this.getIdentity(connection);

    const resp = await connection.request(
      Endpoints.VERIFY_SIGNATURE,
      api.VerifySignatureRequest,
      api.VerifySignatureResponse,
      {
        message: Buffer.from(message, 'utf-8'),
        signature,
        publicKey: identity.public_key,
      }
    );
    return {
      signed_by: resp.valid ? identity.public_key : '',
      signature,
      is_valid: resp.valid || false,
    };
  }

  // ── Backups (not supported) ──

  async getBackups(_connection: LdkServerClient) {
    throw new Error(NOT_SUPPORTED);
  }

  async verifyBackup(_connection: LdkServerClient, _backup: string) {
    throw new Error(NOT_SUPPORTED);
  }

  async verifyBackups(
    _connection: LdkServerClient,
    _args: VerifyBackupsOptions
  ) {
    throw new Error(NOT_SUPPORTED);
  }

  async recoverFundsFromChannels(
    _connection: LdkServerClient,
    _backup: string
  ) {
    throw new Error(NOT_SUPPORTED);
  }

  // ── Access (not supported) ──

  async grantAccess(
    _connection: LdkServerClient,
    _permissions: GrantAccessOptions
  ) {
    throw new Error(NOT_SUPPORTED);
  }

  // ── Crypto (not supported) ──

  async diffieHellmanComputeSecret(
    _connection: LdkServerClient,
    _options: DiffieHellmanComputeSecretOptions
  ) {
    throw new Error(NOT_SUPPORTED);
  }
}

// ── Mapping helpers ──

function mapChannel(ch: types.IChannel) {
  return {
    capacity: toNumber(ch.channelValueSats),
    commit_transaction_fee: 0,
    commit_transaction_weight: 0,
    id: ch.channelId || '',
    is_active: ch.isUsable || false,
    is_closing: false,
    is_opening: !ch.isChannelReady,
    is_partner_initiated: !ch.isOutbound,
    is_private: !ch.isAnnounced,
    local_balance: msatToSat(ch.outboundCapacityMsat),
    local_reserve: toNumber(ch.unspendablePunishmentReserve),
    partner_public_key: ch.counterpartyNodeId || '',
    past_states: 0,
    received: 0,
    remote_balance: msatToSat(ch.inboundCapacityMsat),
    remote_reserve: toNumber(ch.counterpartyUnspendablePunishmentReserve),
    sent: 0,
    time_offline: 0,
    time_online: 0,
    transaction_id: ch.fundingTxo?.txid || '',
    transaction_vout: ch.fundingTxo?.vout || 0,
    unsettled_balance: 0,
    pending_payments: [],
  };
}

function mapGraphChannelUpdate(
  update: types.IGraphChannelUpdate | null | undefined,
  publicKey: string
) {
  if (!update) {
    return {
      public_key: publicKey,
      base_fee_mtokens: '0',
      cltv_delta: 0,
      fee_rate: 0,
      is_disabled: true,
      max_htlc_mtokens: '0',
      min_htlc_mtokens: '0',
      updated_at: '',
    };
  }
  return {
    public_key: publicKey,
    base_fee_mtokens: toNumber(update.fees?.baseMsat).toString(),
    cltv_delta: update.cltvExpiryDelta || 0,
    fee_rate: toNumber(update.fees?.proportionalMillionths),
    is_disabled: !update.enabled,
    max_htlc_mtokens: toNumber(update.htlcMaximumMsat).toString(),
    min_htlc_mtokens: toNumber(update.htlcMinimumMsat).toString(),
    updated_at: update.lastUpdate
      ? new Date(toNumber(update.lastUpdate) * 1000).toISOString()
      : '',
  };
}

function mapPayment(p: types.IPayment) {
  const amountMsat = toNumber(p.amountMsat);
  const feeMsat = toNumber(p.feePaidMsat);
  const timestamp = toNumber(p.latestUpdateTimestamp);

  let hash = '';
  let preimage = '';
  if (p.kind?.bolt11) {
    hash = p.kind.bolt11.hash || '';
    preimage = p.kind.bolt11.preimage || '';
  } else if (p.kind?.spontaneous) {
    hash = p.kind.spontaneous.hash || '';
    preimage = p.kind.spontaneous.preimage || '';
  } else if (p.kind?.bolt12Offer) {
    hash = p.kind.bolt12Offer.hash || '';
    preimage = p.kind.bolt12Offer.preimage || '';
  }

  return {
    created_at: timestamp
      ? new Date(timestamp * 1000).toISOString()
      : new Date().toISOString(),
    destination: '',
    fee: msatToSat(feeMsat),
    fee_mtokens: feeMsat.toString(),
    hops: [],
    id: p.id || hash || '',
    index: 0,
    is_confirmed: p.status === types.PaymentStatus.SUCCEEDED,
    is_outgoing: p.direction === types.PaymentDirection.OUTBOUND,
    mtokens: amountMsat.toString(),
    request: '',
    safe_fee: msatToSat(feeMsat),
    safe_tokens: msatToSat(amountMsat),
    secret: preimage,
    tokens: msatToSat(amountMsat),
  };
}

function mapInvoice(p: types.IPayment) {
  const amountMsat = toNumber(p.amountMsat);
  const timestamp = toNumber(p.latestUpdateTimestamp);
  const isConfirmed = p.status === types.PaymentStatus.SUCCEEDED;

  let hash = '';
  let preimage = '';
  let secret: Uint8Array | null = null;
  if (p.kind?.bolt11) {
    hash = p.kind.bolt11.hash || '';
    preimage = p.kind.bolt11.preimage || '';
    secret = (p.kind.bolt11.secret as Uint8Array) || null;
  } else if (p.kind?.bolt11Jit) {
    hash = p.kind.bolt11Jit.hash || '';
    preimage = p.kind.bolt11Jit.preimage || '';
    secret = (p.kind.bolt11Jit.secret as Uint8Array) || null;
  } else if (p.kind?.bolt12Offer) {
    hash = p.kind.bolt12Offer.hash || '';
    preimage = p.kind.bolt12Offer.preimage || '';
    secret = (p.kind.bolt12Offer.secret as Uint8Array) || null;
  }

  const dateStr = timestamp
    ? new Date(timestamp * 1000).toISOString()
    : new Date().toISOString();

  return {
    chain_address: undefined,
    confirmed_at: isConfirmed ? dateStr : undefined,
    created_at: dateStr,
    description: '',
    description_hash: '',
    expires_at: '',
    id: hash || p.id || '',
    is_canceled: p.status === types.PaymentStatus.FAILED,
    is_confirmed: isConfirmed,
    is_held: false,
    is_private: false,
    is_push: false,
    received: isConfirmed ? msatToSat(amountMsat) : 0,
    received_mtokens: isConfirmed ? amountMsat.toString() : '0',
    request: '',
    secret: secret ? Buffer.from(secret).toString('hex') : preimage || '',
    tokens: msatToSat(amountMsat),
    payments: [],
  };
}
