import { FC, useEffect } from 'react';
import { Card } from '../../components/generic/CardGeneric';
import { renderLine } from '../../components/generic/helpers';
import {
  CardWithTitle,
  SubCard,
  SubTitle,
} from '../../components/generic/Styled';
import { useSocket, useSocketEvent } from '../../hooks/UseSocket';
import { btcToSat, formatSats } from '../../utils/helpers';

type RebalanceProps = {
  messages: any[];
  setMessages: (state: (state: any[]) => any[]) => void;
};

export const RebalanceLogs: FC<RebalanceProps> = ({
  messages,
  setMessages,
}) => {
  const { socket } = useSocket();
  const { lastMessage } = useSocketEvent(socket, 'rebalance');

  useEffect(() => {
    if (!lastMessage) return;
    setMessages(state => [lastMessage, ...state]);
  }, [lastMessage, setMessages]);

  const renderContent = () => {
    return messages.map(m => {
      if ('rebalance_target_amount' in m) {
        return (
          <SubCard>
            {renderLine(
              'Amount',
              formatSats(btcToSat(m.rebalance_target_amount))
            )}
            {renderLine('Incoming Peer', m.incoming_peer_to_decrease_inbound)}
            {renderLine('Outgoing Peer', m.outgoing_peer_to_increase_inbound)}
          </SubCard>
        );
      }
      if ('circular_rebalance_for' in m) {
        return (
          <SubCard>
            {renderLine('Rebalancing peer', m.circular_rebalance_for)}
          </SubCard>
        );
      }
      if ('evaluating' in m) {
        return (
          <SubCard>
            {m.evaluating.map((s: string, index: number) =>
              renderLine(index + 1, s)
            )}
          </SubCard>
        );
      }
      if ('evaluating_amount' in m) {
        return (
          <SubCard>
            {renderLine('Evaluating amount', formatSats(m.evaluating_amount))}
          </SubCard>
        );
      }
      if ('failure' in m) {
        return <SubCard>{renderLine('Failure', m.failure)}</SubCard>;
      }
      return null;
    });
  };

  if (!messages.length) {
    return null;
  }

  return (
    <CardWithTitle>
      <SubTitle>Logs</SubTitle>
      <Card>{renderContent()}</Card>
    </CardWithTitle>
  );
};
