import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowDown, ArrowUp } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import { PeerType } from '../../graphql/types';
import {
  SubCard,
  Separation,
  Sub4Title,
  ResponsiveLine,
  ResponsiveSingle,
  ResponsiveCol,
  RightAlign,
} from '../../components/generic/Styled';
import {
  renderLine,
  getDateDif,
  getFormatDate,
  getNodeLink,
} from '../../components/generic/helpers';
import {
  Progress,
  ProgressBar,
  NodeTitle,
  MainInfo,
} from '../../components/generic/CardGeneric';
import { getPercent } from '../../utils/helpers';
import { useConfigState } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';
import { getPrice } from '../../components/price/Price';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import Modal from '../../components/modal/ReactModal';
import { RemovePeerModal } from '../../components/modal/removePeer/RemovePeer';

const IconPadding = styled.div`
  margin-left: 16px;
  margin-right: 8px;
`;

const getSymbol = (status: boolean) => {
  return status ? <ArrowDown size={18} /> : <ArrowUp size={18} />;
};

interface PeerProps {
  peer: PeerType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const PeersCard = ({
  peer,
  index,
  setIndexOpen,
  indexOpen,
}: PeerProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();

  const format = getPrice(currency, displayValues, priceContext);

  const {
    bytes_received,
    bytes_sent,
    is_inbound,
    is_sync_peer,
    ping_time,
    public_key,
    socket,
    tokens_received,
    tokens_sent,
    partner_node_info,
  } = peer;

  const formatReceived = format({ amount: tokens_received });
  const formatSent = format({ amount: tokens_sent });

  const { alias, capacity, channel_count, color, updated_at } =
    partner_node_info?.node || {};

  const formatCapacity = format({ amount: capacity });

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
        {renderLine('Amount Received:', formatReceived)}
        {renderLine('Amount Sent:', formatSent)}
        {renderLine('bytes Received:', bytes_received)}
        {renderLine('bytes Sent:', bytes_sent)}
        {renderLine('Public Key:', getNodeLink(public_key))}
        {renderLine('Socket:', socket)}
        {renderLine('Is Inbound:', is_inbound.toString())}
        {renderLine('Is Sync Peer:', is_sync_peer?.toString())}
        {renderLine('Ping Time:', ping_time)}
        <Sub4Title>Partner Node Info</Sub4Title>
        {renderLine('Node Capacity:', formatCapacity)}
        {renderLine('Channel Count:', channel_count)}
        {updated_at &&
          renderLine(
            'Last Update:',
            `${getDateDif(updated_at)} ago (${getFormatDate(updated_at)})`
          )}
        <Separation />
        <RightAlign>
          <ColorButton
            withBorder={true}
            arrow={true}
            onClick={() => setModalOpen(true)}
          >
            Remove Peer
          </ColorButton>
        </RightAlign>
      </>
    );
  };

  return (
    <SubCard key={`${index}-${public_key}`} subColor={color}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <NodeTitle style={{ flexGrow: 2 }}>
            {alias || public_key?.substring(0, 6)}
          </NodeTitle>
          <ResponsiveSingle>
            <IconPadding>{getSymbol(is_inbound)}</IconPadding>
            <ResponsiveCol>
              <Progress data-tip data-for={`node_balance_tip_${index}`}>
                <ProgressBar percent={getPercent(bytes_received, bytes_sent)} />
              </Progress>
              <Progress data-tip data-for={`node_activity_tip_${index}`}>
                <ProgressBar
                  order={2}
                  percent={getPercent(tokens_received, tokens_sent)}
                />
              </Progress>
            </ResponsiveCol>
          </ResponsiveSingle>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderLine('bytes Received', bytes_received)}
        {renderLine('bytes Sent', bytes_sent)}
      </ReactTooltip>
      <ReactTooltip
        id={`node_activity_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderLine('Amount Received', formatReceived)}
        {renderLine('Amount Sent', formatSent)}
      </ReactTooltip>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <RemovePeerModal
          setModalOpen={setModalOpen}
          publicKey={public_key}
          peerAlias={alias}
        />
      </Modal>
    </SubCard>
  );
};
