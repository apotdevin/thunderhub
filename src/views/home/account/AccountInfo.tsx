import React, { useState } from 'react';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  DarkSubTitle,
  ColorButton,
  ResponsiveLine,
} from '../../../components/generic/Styled';
import styled from 'styled-components';
import {
  UpArrow,
  Zap,
  Anchor,
  Pocket,
  DownArrow,
  XSvg,
} from '../../../components/generic/Icons';
import { PayCard } from './pay/pay';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { Price } from '../../../components/price/Price';
import { mediaWidths } from '../../../styles/Themes';
import { useStatusState } from '../../../context/StatusContext';

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

const ButtonRow = styled.div`
  display: flex;
`;

const sectionColor = '#FFD300';

export const AccountInfo = () => {
  const [state, setState] = useState<string>('none');

  const {
    loading,
    chainBalance,
    chainPending,
    channelBalance,
    channelPending,
  } = useStatusState();

  if (loading) {
    return (
      <>
        <LoadingCard title={'Resume'} />
        <LoadingCard title={'Your Accounts'} />
      </>
    );
  }

  const formatCB = <Price amount={chainBalance} />;
  const formatPB = <Price amount={chainPending} />;
  const formatCCB = <Price amount={channelBalance} />;
  const formatPCB = <Price amount={channelPending} />;

  const totalB = <Price amount={chainBalance + channelBalance} />;
  const totalPB = <Price amount={chainPending + channelPending} />;

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

  const renderBalances = (current: JSX.Element, pending: JSX.Element) => (
    <>
      <Tile>
        <DarkSubTitle>Current Balance</DarkSubTitle>
        <div>{current}</div>
      </Tile>
      <Tile>
        <DarkSubTitle>Pending Balance</DarkSubTitle>
        <div>{pending}</div>
      </Tile>
    </>
  );

  const renderButtons = (send: string, receive: string) => (
    <>
      <ColorButton color={sectionColor} onClick={() => setState(send)}>
        <UpArrow />
      </ColorButton>
      <ColorButton color={sectionColor} onClick={() => setState(receive)}>
        <DownArrow />
      </ColorButton>
    </>
  );

  const renderLnAccount = () => (
    <ResponsiveLine>
      <Zap color={channelPending === 0 ? sectionColor : '#652EC7'} />
      <Tile startTile={true}>
        <DarkSubTitle>Account</DarkSubTitle>
        <div>Lightning</div>
      </Tile>
      {renderBalances(formatCCB, formatPCB)}
      <AdminSwitch>
        <ButtonRow>
          {showLn && showChain && renderButtons('send_ln', 'receive_ln')}
          {showLn && !showChain && (
            <ColorButton color={sectionColor} onClick={() => setState('none')}>
              <XSvg />
            </ColorButton>
          )}
        </ButtonRow>
      </AdminSwitch>
    </ResponsiveLine>
  );

  const renderChainAccount = () => (
    <ResponsiveLine>
      <Anchor color={chainPending === 0 ? sectionColor : '#652EC7'} />
      <Tile startTile={true}>
        <DarkSubTitle>Account</DarkSubTitle>
        <div>Bitcoin</div>
      </Tile>
      {renderBalances(formatCB, formatPB)}
      <AdminSwitch>
        <ButtonRow>
          {showLn && showChain && renderButtons('send_chain', 'receive_chain')}
          {!showLn && showChain && (
            <ColorButton color={sectionColor} onClick={() => setState('none')}>
              <XSvg />
            </ColorButton>
          )}
        </ButtonRow>
      </AdminSwitch>
    </ResponsiveLine>
  );

  return (
    <>
      <CardWithTitle>
        <SubTitle>Resume</SubTitle>
        <Card>
          <ResponsiveLine>
            <Pocket
              color={
                chainPending === 0 && channelPending === 0
                  ? '#2bbc54'
                  : '#652EC7'
              }
            />
            <Tile startTile={true}>
              <DarkSubTitle>Account</DarkSubTitle>
              <div>Total</div>
            </Tile>
            {renderBalances(totalB, totalPB)}
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
