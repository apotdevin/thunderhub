import * as React from 'react';
import { Title } from '../../components/typography/Styled';
import { Input } from '../../components/input/Input';
import { useGetPeersQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import {
  SubCard,
  ResponsiveSingle,
  SubTitle,
  SingleLine,
  Separation,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { XSvg } from '../../components/generic/Icons';
import { ChatInput } from './ChatInput';
import { ChatStyledStart } from './Chat.styled';

interface PeerProps {
  peer: any;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const PeerChatCard = ({ peer, index, setIndexOpen, indexOpen }: PeerProps) => {
  const { partner_node_info, public_key } = peer;

  const { alias } = partner_node_info;

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
        <ChatInput alias={alias} sender={public_key} />
      </>
    );
  };

  return (
    <SubCard>
      <ResponsiveSingle>
        <SubTitle>{alias || public_key.slice(0, 6)}</SubTitle>
        <ColorButton
          onClick={handleClick}
          arrow={index === indexOpen ? false : true}
        >
          {index === indexOpen ? <XSvg /> : 'Chat'}
        </ColorButton>
      </ResponsiveSingle>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};

export const ChatStart = ({ noTitle }: { noTitle?: boolean }) => {
  const [indexOpen, setIndexOpen] = React.useState(0);
  const [willSend, setWillSend] = React.useState(false);
  const [publicKey, setPublicKey] = React.useState('');
  const { auth } = useAccount();
  const { loading, data } = useGetPeersQuery({
    skip: !auth,
    variables: { auth },
  });

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
              key={`${index}-${peer.public_key}`}
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
          <XSvg />
        </ColorButton>
      </SingleLine>
      <ChatInput alias={''} sender={publicKey} />
    </SubCard>
  );

  return (
    <ChatStyledStart>
      {!noTitle && <Title>Start your first chat</Title>}
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
            {willSend ? <XSvg /> : 'Chat'}
          </ColorButton>
        </SingleLine>
      )}
      {willSend && renderStartChat(publicKey)}
      {renderPeers()}
    </ChatStyledStart>
  );
};
