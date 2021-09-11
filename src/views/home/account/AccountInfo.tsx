import React, { useState } from 'react';
import styled from 'styled-components';
import { Zap, Anchor, Pocket, HelpCircle, X } from 'react-feather';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import ReactTooltip from 'react-tooltip';
import { renderLine } from 'src/components/generic/helpers';
import { useNodeBalances } from 'src/hooks/UseNodeBalances';
import Big from 'big.js';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  DarkSubTitle,
  ResponsiveLine,
} from '../../../components/generic/Styled';
import { Price } from '../../../components/price/Price';
import { mediaWidths } from '../../../styles/Themes';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { PayCard } from './pay/Payment';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ startTile }: { startTile?: boolean }) =>
    startTile ? 'flex-start' : 'flex-end'};

  @media (${mediaWidths.mobile}) {
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    margin: 0 0 8px;
  }
`;

const AccountButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (${mediaWidths.mobile}) {
    flex-direction: row;
    width: 100%;
  }
`;

const sectionColor = '#FFD300';

export const AccountInfo = () => {
  const [state, setState] = useState<string>('none');

  const { onchain, lightning } = useNodeBalances();

  const totalAmount = new Big(onchain.confirmed)
    .add(onchain.pending)
    .add(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const chainBalance = Number(onchain.confirmed);
  const chainPending = Number(onchain.pending);
  const channelBalance = Number(lightning.confirmed);
  const channelPending = Number(lightning.pending);

  const renderContent = () => {
    switch (state) {
      case 'send_ln':
        return <PayCard setOpen={() => setState('none')} />;
      case 'receive_ln':
        return <CreateInvoiceCard color={sectionColor} />;
      case 'send_chain':
        return <SendOnChainCard setOpen={() => setState('none')} />;
      case 'receive_chain':
        return <ReceiveOnChainCard />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'send_ln':
        return 'Send Sats over Lightning';
      case 'receive_ln':
        return 'Receive Sats over Lightning';
      case 'send_chain':
        return 'Send To On Chain Address';
      case 'receive_chain':
        return 'Create Address to Receive';
      default:
        return 'Your Accounts';
    }
  };

  const showLn =
    state === 'send_ln' || state === 'receive_ln' || state === 'none';
  const showChain =
    state === 'send_chain' || state === 'receive_chain' || state === 'none';

  const renderBalances = (current: number, pending: number, key: string) => (
    <>
      <Tile>
        <DarkSubTitle>Pending Balance</DarkSubTitle>
        <div>
          <Price amount={pending} />
        </div>
      </Tile>
      <Tile data-tip data-for={key}>
        <DarkSubTitle>
          Total Balance{pending > 0 && <HelpCircle size={12} />}
        </DarkSubTitle>
        <div>
          <Price amount={current + pending} />
        </div>
      </Tile>
      <ReactTooltip id={key} effect={'solid'} place={'bottom'}>
        {renderLine('Total', <Price amount={current + pending} />)}
        <Separation withMargin={'8px 0'} />
        {renderLine('Current', <Price amount={current} />)}
        {renderLine('Pending', <Price amount={pending} />)}
      </ReactTooltip>
    </>
  );

  const renderButtons = (send: string, receive: string) => (
    <AccountButtonWrapper>
      <ColorButton
        fullWidth={true}
        withMargin={'0 0 2px'}
        mobileMargin={'8px 4px 0 0'}
        onClick={() => setState(send)}
      >
        Send
      </ColorButton>
      <ColorButton
        fullWidth={true}
        withMargin={'2px 0 0'}
        mobileMargin={'8px 0 0 4px'}
        onClick={() => setState(receive)}
      >
        Receive
      </ColorButton>
    </AccountButtonWrapper>
  );

  const renderLnAccount = () => (
    <ResponsiveLine>
      <Zap size={18} color={channelPending === 0 ? sectionColor : '#652EC7'} />
      <Tile startTile={true}>
        <DarkSubTitle>Account</DarkSubTitle>
        <div>Lightning</div>
      </Tile>
      {renderBalances(channelBalance, channelPending, 'lightning')}
      {showLn && showChain && renderButtons('send_ln', 'receive_ln')}
      {showLn && !showChain && (
        <ColorButton onClick={() => setState('none')}>
          <X size={18} />
        </ColorButton>
      )}
    </ResponsiveLine>
  );

  const renderChainAccount = () => (
    <ResponsiveLine>
      <Anchor size={18} color={chainPending === 0 ? sectionColor : '#652EC7'} />
      <Tile startTile={true}>
        <DarkSubTitle>Account</DarkSubTitle>
        <div>Bitcoin</div>
      </Tile>
      {renderBalances(chainBalance, chainPending, 'onchain')}
      {showLn && showChain && renderButtons('send_chain', 'receive_chain')}
      {!showLn && showChain && (
        <ColorButton onClick={() => setState('none')}>
          <X size={18} />
        </ColorButton>
      )}
    </ResponsiveLine>
  );

  return (
    <>
      <CardWithTitle>
        <SubTitle>Resume</SubTitle>
        <Card>
          <ResponsiveLine>
            <Pocket
              size={18}
              color={
                chainPending === 0 && channelPending === 0
                  ? '#2bbc54'
                  : '#652EC7'
              }
            />
            <Tile>
              <DarkSubTitle>Total</DarkSubTitle>
              <div>
                <Price amount={totalAmount} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Bitcoin</DarkSubTitle>
              <div>
                <Price amount={totalChain} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Lightning</DarkSubTitle>
              <div>
                <Price amount={totalLightning} />
              </div>
            </Tile>
          </ResponsiveLine>
        </Card>
      </CardWithTitle>
      <CardWithTitle>
        <SubTitle>{getTitle()}</SubTitle>
        <Card>
          {showLn && renderLnAccount()}
          {showLn && <Separation />}
          {showChain && renderChainAccount()}
          {!showLn && showChain && <Separation />}
          {renderContent()}
        </Card>
      </CardWithTitle>
    </>
  );
};
