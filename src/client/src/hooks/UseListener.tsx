import { useApolloClient } from '@apollo/client';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  getNodeLink,
  getTransactionLink,
  renderLine,
} from '../components/generic/helpers';
import { Separation } from '../components/generic/Styled';
import { useNotificationState } from '../context/NotificationContext';
import { formatSats } from '../utils/helpers';
import { useChannelInfo } from './UseChannelInfo';
import { useNodeDetails } from './UseNodeDetails';
import { useSocket, useSocketEvent } from './UseSocket';

const refetchTimeMs = 1000 * 1;

const renderToast = (
  title: string,
  content: JSX.Element | null | string | number
) => {
  return (
    <>
      {title}
      <Separation lineColor={'transparent'} withMargin="4px 0" />
      {content}
    </>
  );
};

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
  const { channels, forwardAttempts, forwards, invoices, payments, autoClose } =
    useNotificationState();

  const options: { autoClose?: false; closeOnClick: boolean } = useMemo(() => {
    return autoClose
      ? { closeOnClick: false }
      : { autoClose: false, closeOnClick: false };
  }, [autoClose]);

  const refetchQueryTimeout: { current: ReturnType<typeof setTimeout> | null } =
    useRef(null);

  const client = useApolloClient();

  const { socket } = useSocket(disabled);

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
        toast.success(
          renderToast(
            'Invoice Paid',
            <>
              {renderLine('Description', description)}
              {renderLine('Description Hash', description_hash)}
              {renderLine('Amount', formatSats(received))}
            </>
          ),
          options
        );
      } else {
        toast.info(
          renderToast(
            'New Invoice Created',
            <>
              {renderLine('Description', description)}
              {renderLine('Description Hash', description_hash)}
              {renderLine('Amount', formatSats(tokens))}
            </>
          ),
          options
        );
      }
      handleRefetchQueries(['GetInvoices']);
    },
    [handleRefetchQueries, invoices, options]
  );

  const handlePayment = useCallback(
    (message: any) => {
      if (!payments) return;

      const { hops, fee, destination, tokens } = message;

      const hopLines = hops.map((h: any, index: number) =>
        renderLine(`Hop ${index + 1}`, h.channel)
      );

      toast.success(
        renderToast(
          'New Payment',
          <>
            {renderLine('Destination', <PeerAlias pubkey={destination} />)}
            {renderLine('Amount', formatSats(tokens))}
            {renderLine('Fee', fee ? formatSats(fee) : null)}
            {hopLines}
          </>
        ),
        options
      );
      handleRefetchQueries(['GetPayments']);
    },
    [handleRefetchQueries, payments, options]
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
        toast.warn(
          renderToast(
            'Forward Attempt',
            <>
              {renderLine('In Peer', <ChannelPeerAlias id={in_channel} />)}
              {renderLine('Out Peer', <ChannelPeerAlias id={out_channel} />)}
              {renderLine('In Channel', in_channel)}
              {renderLine('Out Channel', out_channel)}
              {renderLine('Tokens', formatSats(tokens))}
              {renderLine('Fee', fee ? formatSats(fee) : null)}
            </>
          ),
          options
        );
      }

      if (is_confirmed && forwards) {
        toast.success(
          renderToast(
            'Successful Forward',
            <>
              {renderLine('In Peer', <ChannelPeerAlias id={in_channel} />)}
              {renderLine('Out Peer', <ChannelPeerAlias id={out_channel} />)}
              {renderLine('In Channel', in_channel)}
              {renderLine('Out Channel', out_channel)}
              {renderLine('Fee', fee ? formatSats(fee) : null)}
            </>
          ),
          options
        );
        handleRefetchQueries(['GetForwards']);
      }
    },
    [handleRefetchQueries, forwardAttempts, forwards, options]
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

      toast.info(
        renderToast(
          'Channel Closed',
          <>
            {renderLine('Reason', getCloseType())}
            {renderLine('Capacity', formatSats(capacity))}
            {renderLine('Id', id)}
            {renderLine('Peer', <PeerAlias pubkey={partner_public_key} />)}
            {renderLine(
              'Tx',
              transaction_id ? getTransactionLink(transaction_id) : null
            )}
            {renderLine(
              'Closing Tx',
              close_transaction_id
                ? getTransactionLink(close_transaction_id)
                : null
            )}
          </>
        ),
        options
      );

      handleRefetchQueries([
        'GetChannels',
        'GetPendingChannels',
        'GetClosedChannels',
      ]);
    },
    [handleRefetchQueries, channels, options]
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

      toast.info(
        renderToast(
          'Channel Opened',
          <>
            {renderLine(
              'Initiated By',
              is_partner_initiated ? 'Your Peer' : 'You'
            )}
            {renderLine('Id', id)}
            {renderLine('Peer', <PeerAlias pubkey={partner_public_key} />)}
            {renderLine('Private', is_private ? 'Yes' : 'No')}
            {renderLine('Capacity', formatSats(capacity))}
            {renderLine('Local', formatSats(local_balance))}
            {renderLine('Remote', formatSats(remote_balance))}
          </>
        ),
        options
      );
      handleRefetchQueries(['GetChannels', 'GetPendingChannels']);
    },
    [handleRefetchQueries, channels, options]
  );

  const handleOpening = useCallback(
    (message: any) => {
      if (!channels) return;

      toast.info(
        renderToast(
          'Channel Opening',
          renderLine('Transaction', getTransactionLink(message.transaction_id))
        ),
        options
      );
      handleRefetchQueries(['GetChannels', 'GetPendingChannels']);
    },
    [handleRefetchQueries, channels, options]
  );

  useSocketEvent(socket, 'invoice_updated', handleInvoice);
  useSocketEvent(socket, 'payment', handlePayment);
  useSocketEvent(socket, 'forward', handleForward);
  useSocketEvent(socket, 'channel_closed', handleClosed);
  useSocketEvent(socket, 'channel_opened', handleOpen);
  useSocketEvent(socket, 'channel_opening', handleOpening);
};
