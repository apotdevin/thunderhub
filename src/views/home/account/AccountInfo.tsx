import React, { useState, ReactNode } from 'react';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Separation,
  DarkSubTitle,
  ColorButton,
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
import { useSize } from '../../../hooks/UseSize';
import { Price } from '../../../components/price/Price';
import { mediaWidths, mediaDimensions } from '../../../styles/Themes';
import { useStatusState } from '../../../context/StatusContext';

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${({ startTile }: { startTile?: boolean }) =>
    startTile ? 'flex-start' : 'flex-end'};
`;

const ButtonRow = styled.div`
  display: flex;
`;

const Responsive = styled(SingleLine)`
  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const sectionColor = '#FFD300';

interface WrapperProps {
  width?: number;
  children: ReactNode;
}

const ResponsiveWrapper = ({ children, width = 0 }: WrapperProps) => {
  if (width <= mediaDimensions.mobile) {
    return <Responsive>{children}</Responsive>;
  }
  return <>{children}</>;
};

export const AccountInfo = () => {
  const { width } = useSize();
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

  const renderLnAccount = () => (
    <SingleLine>
      <ResponsiveWrapper width={width}>
        <Zap color={channelPending === 0 ? sectionColor : '#652EC7'} />
        <Tile startTile={true}>
          <DarkSubTitle>Account</DarkSubTitle>
          <div>Lightning</div>
        </Tile>
      </ResponsiveWrapper>
      <ResponsiveWrapper width={width}>
        <Tile>
          <DarkSubTitle>Current Balance</DarkSubTitle>
          <div>{formatCCB}</div>
        </Tile>
        <Tile>
          <DarkSubTitle>Pending Balance</DarkSubTitle>
          <div>{formatPCB}</div>
        </Tile>
      </ResponsiveWrapper>
      <AdminSwitch>
        <ButtonRow>
          {showLn && showChain && (
            <ResponsiveWrapper width={width}>
              <ColorButton
                color={sectionColor}
                onClick={() => setState('send_ln')}
              >
                <UpArrow />
              </ColorButton>
              <ColorButton
                color={sectionColor}
                onClick={() => setState('receive_ln')}
              >
                <DownArrow />
              </ColorButton>
            </ResponsiveWrapper>
          )}
          {showLn && !showChain && (
            <ColorButton color={sectionColor} onClick={() => setState('none')}>
              <XSvg />
            </ColorButton>
          )}
        </ButtonRow>
      </AdminSwitch>
    </SingleLine>
  );

  const renderChainAccount = () => (
    <SingleLine>
      <ResponsiveWrapper width={width}>
        <Anchor color={chainPending === 0 ? sectionColor : '#652EC7'} />
        <Tile startTile={true}>
          <DarkSubTitle>Account</DarkSubTitle>
          <div>Bitcoin</div>
        </Tile>
      </ResponsiveWrapper>
      <ResponsiveWrapper width={width}>
        <Tile>
          <DarkSubTitle>Current Balance</DarkSubTitle>
          <div>{formatCB}</div>
        </Tile>
        <Tile>
          <DarkSubTitle>Pending Balance</DarkSubTitle>
          <div>{formatPB}</div>
        </Tile>
      </ResponsiveWrapper>
      <AdminSwitch>
        <ButtonRow>
          {showLn && showChain && (
            <ResponsiveWrapper width={width}>
              <ColorButton
                color={sectionColor}
                onClick={() => setState('send_chain')}
              >
                <UpArrow />
              </ColorButton>
              <ColorButton
                color={sectionColor}
                onClick={() => setState('receive_chain')}
              >
                <DownArrow />
              </ColorButton>
            </ResponsiveWrapper>
          )}
          {!showLn && showChain && (
            <ColorButton color={sectionColor} onClick={() => setState('none')}>
              <XSvg />
            </ColorButton>
          )}
        </ButtonRow>
      </AdminSwitch>
    </SingleLine>
  );

  return (
    <>
      <CardWithTitle>
        <SubTitle>Resume</SubTitle>
        <Card>
          <SingleLine>
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
            <ResponsiveWrapper width={width}>
              <Tile>
                <DarkSubTitle>Current Balance</DarkSubTitle>
                <div>{totalB}</div>
              </Tile>
              <Tile>
                <DarkSubTitle>Pending Balance</DarkSubTitle>
                <div>{totalPB}</div>
              </Tile>
            </ResponsiveWrapper>
          </SingleLine>
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
