import { useApolloClient } from '@apollo/client';
import { FC, useCallback, useEffect, useRef } from 'react';
import { getNodeLink, getTransactionLink } from '../components/generic/helpers';
import { useNotificationState } from '../context/NotificationContext';
import { useEventLog, EventField } from '../context/EventLogContext';
import { formatSats } from '../utils/helpers';
import { useChannelInfo } from './UseChannelInfo';
import { useNodeDetails } from './UseNodeDetails';
import { useSse, useSseEvent } from './useSse';

const refetchTimeMs = 1000 * 1;

const PeerAlias: FC<{ pubkey: string }> = ({ pubkey }) => {
  const { alias } = useNodeDetails(pubkey);

  return <div>{getNodeLink(pubkey, alias)}</div>;
};

const ChannelPeerAlias: FC<{ id: string }> = ({ id }) => {
  const {
    peer: { alias, pubkey },
  } = useChannelInfo(id);

  return <div> {getNodeLink(pubkey, alias)}</div>;
};

export const useListener = (disabled?: boolean) => {
  const { channels, forwardAttempts, forwards, invoices, payments } =
    useNotificationState();

  const { addEvent } = useEventLog();

  const refetchQueryTimeout: { current: ReturnType<typeof setTimeout> | null } =
    useRef(null);

  const client = useApolloClient();

  useSse(disabled);

  const handleRefetchQueries = useCallback(
    (extra: string[] = []) => {
      if (!!refetchQueryTimeout.current) {
        clearTimeout(refetchQueryTimeout.current);
      }

      refetchQueryTimeout.current = setTimeout(async () => {
        client.refetchQueries({
          include: ['GetNodeBalances', 'GetNodeInfo', ...extra],
        });
      }, refetchTimeMs);
    },
    [client]
  );

  useEffect(() => {
    return () => {
      if (!!refetchQueryTimeout.current) {
        clearTimeout(refetchQueryTimeout.current);
      }
    };
  }, []);

  const handleInvoice = useCallback(
    (message: any) => {
      if (!invoices) return;

      const { tokens, is_confirmed, description, description_hash, received } =
        message;

      if (is_confirmed) {
        addEvent({
          title: 'Invoice Paid',
          summary: [{ label: 'Amount', value: formatSats(received) }],
          details: [
            { label: 'Description', value: description },
            { label: 'Description Hash', value: description_hash },
          ],
        });
      } else {
        addEvent({
          title: 'New Invoice Created',
          summary: [{ label: 'Amount', value: formatSats(tokens) }],
          details: [
            { label: 'Description', value: description },
            { label: 'Description Hash', value: description_hash },
          ],
        });
      }
      handleRefetchQueries(['GetInvoices']);
    },
    [handleRefetchQueries, invoices, addEvent]
  );

  const handlePayment = useCallback(
    (message: any) => {
      if (!payments) return;

      const { hops, fee, destination, tokens } = message;

      const hopFields: EventField[] = hops.map((h: any, index: number) => ({
        label: `Hop ${index + 1}`,
        value: h.channel,
      }));

      addEvent({
        title: 'New Payment',
        summary: [
          { label: 'Amount', value: formatSats(tokens) },
          { label: 'Destination', value: <PeerAlias pubkey={destination} /> },
        ],
        details: [
          ...(fee ? [{ label: 'Fee', value: formatSats(fee) }] : []),
          ...hopFields,
        ],
      });
      handleRefetchQueries(['GetPayments']);
    },
    [handleRefetchQueries, payments, addEvent]
  );

  const handleForward = useCallback(
    (message: any) => {
      const {
        is_confirmed,
        is_receive,
        is_send,
        out_channel,
        fee,
        in_channel,
        tokens,
      } = message;

      if (is_send || is_receive) return;

      if (!is_confirmed && forwardAttempts) {
        addEvent({
          title: 'Forward Attempt',
          summary: [{ label: 'Tokens', value: formatSats(tokens) }],
          details: [
            { label: 'In Peer', value: <ChannelPeerAlias id={in_channel} /> },
            { label: 'Out Peer', value: <ChannelPeerAlias id={out_channel} /> },
            { label: 'In Channel', value: in_channel },
            { label: 'Out Channel', value: out_channel },
            ...(fee ? [{ label: 'Fee', value: formatSats(fee) }] : []),
          ],
          status: 'error',
        });
      }

      if (is_confirmed && forwards) {
        addEvent({
          title: 'Successful Forward',
          summary: fee ? [{ label: 'Fee', value: formatSats(fee) }] : [],
          details: [
            { label: 'In Peer', value: <ChannelPeerAlias id={in_channel} /> },
            { label: 'Out Peer', value: <ChannelPeerAlias id={out_channel} /> },
            { label: 'In Channel', value: in_channel },
            { label: 'Out Channel', value: out_channel },
          ],
        });
        handleRefetchQueries(['GetForwards']);
      }
    },
    [handleRefetchQueries, forwardAttempts, forwards, addEvent]
  );

  const handleClosed = useCallback(
    (message: any) => {
      if (!channels) return;

      const {
        capacity,
        close_transaction_id,
        id,
        is_breach_close,
        is_cooperative_close,
        is_funding_cancel,
        is_local_force_close,
        is_remote_force_close,
        partner_public_key,
        transaction_id,
      } = message;

      const getCloseType = (): string => {
        const types: string[] = [];

        if (is_breach_close) {
          types.push('Breach');
        }
        if (is_cooperative_close) {
          types.push('Cooperative');
        }
        if (is_funding_cancel) {
          types.push('Funding Cancel');
        }
        if (is_local_force_close) {
          types.push('Local Force Close');
        }
        if (is_remote_force_close) {
          types.push('Remote Force Close');
        }

        return types.join(', ');
      };

      addEvent({
        title: 'Channel Closed',
        summary: [
          { label: 'Reason', value: getCloseType() },
          { label: 'Capacity', value: formatSats(capacity) },
        ],
        details: [
          { label: 'Id', value: id },
          {
            label: 'Peer',
            value: <PeerAlias pubkey={partner_public_key} />,
          },
          ...(transaction_id
            ? [{ label: 'Tx', value: getTransactionLink(transaction_id) }]
            : []),
          ...(close_transaction_id
            ? [
                {
                  label: 'Closing Tx',
                  value: getTransactionLink(close_transaction_id),
                },
              ]
            : []),
        ],
      });

      handleRefetchQueries([
        'GetChannels',
        'GetPendingChannels',
        'GetClosedChannels',
      ]);
    },
    [handleRefetchQueries, channels, addEvent]
  );

  const handleOpen = useCallback(
    (message: any) => {
      if (!channels) return;

      const {
        id,
        partner_public_key,
        remote_balance,
        local_balance,
        capacity,
        is_partner_initiated,
        is_private,
      } = message;

      addEvent({
        title: 'Channel Opened',
        summary: [
          { label: 'Capacity', value: formatSats(capacity) },
          {
            label: 'Initiated By',
            value: is_partner_initiated ? 'Your Peer' : 'You',
          },
        ],
        details: [
          { label: 'Id', value: id },
          {
            label: 'Peer',
            value: <PeerAlias pubkey={partner_public_key} />,
          },
          { label: 'Private', value: is_private ? 'Yes' : 'No' },
          { label: 'Local', value: formatSats(local_balance) },
          { label: 'Remote', value: formatSats(remote_balance) },
        ],
      });
      handleRefetchQueries(['GetChannels', 'GetPendingChannels']);
    },
    [handleRefetchQueries, channels, addEvent]
  );

  const handleOpening = useCallback(
    (message: any) => {
      if (!channels) return;

      addEvent({
        title: 'Channel Opening',
        summary: [
          {
            label: 'Transaction',
            value: getTransactionLink(message.transaction_id),
          },
        ],
      });
      handleRefetchQueries(['GetChannels', 'GetPendingChannels']);
    },
    [handleRefetchQueries, channels, addEvent]
  );

  useSseEvent('invoice_updated', handleInvoice);
  useSseEvent('payment', handlePayment);
  useSseEvent('forward', handleForward);
  useSseEvent('channel_closed', handleClosed);
  useSseEvent('channel_opened', handleOpen);
  useSseEvent('channel_opening', handleOpening);
};
