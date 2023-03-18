import * as React from 'react';
import { X, ChevronRight } from 'react-feather';
import { useGetPeersQuery } from '../../../graphql/queries/__generated__/getPeers.generated';
import { Peer } from '../../../graphql/types';
import { Input } from '../../../components/input';
import {
  SubCard,
  ResponsiveSingle,
  SubTitle,
  SingleLine,
  Separation,
} from '../../../components/generic/Styled';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { ChatInput } from './ChatInput';
import {
  ChatStyledStart,
  ChatTitle,
  ChatSubCard,
  ChatStyledSubTitle,
} from './Chat.styled';

interface PeerProps {
  peer: Peer;
  index: number;
  indexOpen: number;
  setIndexOpen: (index: number) => void;
  callback?: () => void;
}

const PeerChatCard = ({
  peer,
  index,
  setIndexOpen,
  indexOpen,
  callback,
}: PeerProps) => {
  const { partner_node_info, public_key } = peer;

  const alias = partner_node_info?.node?.alias || 'Unknown';

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderDetails = () => {
    return (
      <>
        <Separation />
        <ChatInput alias={alias} sender={public_key} callback={callback} />
      </>
    );
  };

  return (
    <ChatSubCard open={index === indexOpen}>
      <ResponsiveSingle onClick={handleClick}>
        <ChatStyledSubTitle>
          {alias || public_key.slice(0, 6)}
        </ChatStyledSubTitle>
        <SingleLine>
          {index === indexOpen ? (
            <X size={18} />
          ) : (
            <>
              Chat
              <ChevronRight size={18} />
            </>
          )}
        </SingleLine>
      </ResponsiveSingle>
      {index === indexOpen && renderDetails()}
    </ChatSubCard>
  );
};

export const ChatStart = ({
  noTitle,
  callback,
}: {
  noTitle?: boolean;
  callback: () => void;
}) => {
  const [indexOpen, setIndexOpen] = React.useState(0);
  const [willSend, setWillSend] = React.useState(false);
  const [publicKey, setPublicKey] = React.useState('');

  const { loading, data } = useGetPeersQuery();

  const renderPeers = () => {
    if (!loading && data?.getPeers) {
      return (
        <>
          <Separation lineColor={'transparent'} />
          <SubTitle>Chat with a current peer</SubTitle>
          {data.getPeers.map((peer, index) => (
            <PeerChatCard
              peer={peer}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
              callback={callback}
              key={`${index}-${peer?.public_key}`}
            />
          ))}
        </>
      );
    }
  };

  const renderStartChat = (publicKey: string) => (
    <SubCard>
      <SingleLine>
        <SubTitle>{`Message to: ${publicKey.slice(0, 6)}...`}</SubTitle>
        <ColorButton onClick={() => setWillSend(p => !p)}>
          <X size={18} />
        </ColorButton>
      </SingleLine>
      <ChatInput alias={''} sender={publicKey} callback={callback} />
    </SubCard>
  );

  return (
    <ChatStyledStart>
      {!noTitle && <ChatTitle>Start your first chat</ChatTitle>}
      <SubTitle>Chat with a new peer</SubTitle>
      {!willSend && (
        <SingleLine>
          <Input
            value={publicKey}
            placeholder={'Public Key'}
            onChange={e => setPublicKey(e.target.value)}
          />
          <ColorButton
            withMargin={'0 0 0 8px'}
            onClick={() => setWillSend(p => !p)}
            arrow={willSend ? false : true}
            disabled={publicKey === ''}
          >
            {willSend ? <X size={18} /> : 'Chat'}
          </ColorButton>
        </SingleLine>
      )}
      {willSend && renderStartChat(publicKey)}
      {renderPeers()}
    </ChatStyledStart>
  );
};
