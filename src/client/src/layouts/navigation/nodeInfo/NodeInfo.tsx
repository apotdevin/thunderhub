import React from 'react';
import { Zap, Anchor, Circle } from 'react-feather';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { getPrice, Price } from '../../../components/price/Price';
import { addEllipsis, renderLine } from '../../../components/generic/helpers';
import { useNodeInfo } from '../../../hooks/UseNodeInfo';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import { unSelectedNavButton } from '../../../styles/Themes';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';

const Closed = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Margin = styled.div`
  margin: 8px 0 2px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  font-size: 14px;
  color: #bfbfbf;
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

const Balance = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 0;
  padding: 0 5px;
  cursor: default;
`;

const Alias = styled.div`
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 2px solid
    ${({ bottomColor }: { bottomColor: string }) => bottomColor};
`;

interface NodeInfoProps {
  isOpen?: boolean;
  isBurger?: boolean;
}

export const NodeInfo = ({ isOpen, isBurger }: NodeInfoProps) => {
  const {
    alias,
    color,
    version,
    syncedToChain,
    activeChannelCount,
    pendingChannelCount,
    closedChannelCount,
    peersCount,
  } = useNodeInfo();

  const { onchain, lightning } = useNodeBalances();

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const formatCB = format({ amount: onchain.confirmed });
  const formatPB = format({ amount: onchain.pending });
  const formatCCB = format({ amount: lightning.confirmed });
  const formatPCB = format({ amount: lightning.pending });

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  if (!alias) return null;

  if (isBurger) {
    return (
      <>
        <SingleLine>
          <SubTitle>{addEllipsis(alias)}</SubTitle>
          <Circle
            size={18}
            strokeWidth={'0'}
            fill={syncedToChain ? '#95de64' : '#ff7875'}
          />
        </SingleLine>
        <SingleLine>
          <Sub4Title>Channels</Sub4Title>
          {`${activeChannelCount} / ${pendingChannelCount} / ${closedChannelCount} / ${peersCount}`}
        </SingleLine>
        <SingleLine>
          <Zap
            size={18}
            color={channelPending === 0 ? '#FFD300' : '#652EC7'}
            fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
          />
          <Price amount={totalLightning} />
        </SingleLine>
        <SingleLine>
          <Anchor
            size={18}
            color={chainPending === 0 ? '#FFD300' : '#652EC7'}
          />
          <Price amount={totalChain} />
        </SingleLine>
      </>
    );
  }

  if (!isOpen) {
    return (
      <>
        <Closed>
          <div data-tip data-for="full_balance_tip">
            <Circle
              size={18}
              strokeWidth={'0'}
              fill={syncedToChain ? '#95de64' : '#ff7875'}
            />
            {(channelPending > 0 || chainPending > 0) && (
              <div>
                <Circle size={18} fill={'#652EC7'} strokeWidth={'0'} />
              </div>
            )}
            <Margin>
              <Zap
                size={18}
                fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
                color={channelPending === 0 ? '#FFD300' : '#652EC7'}
              />
            </Margin>
            <Anchor
              size={18}
              color={chainPending === 0 ? '#FFD300' : '#652EC7'}
            />
          </div>
          <div data-tip data-for="full_node_tip">
            <SingleLine>{activeChannelCount}</SingleLine>
            <SingleLine>{pendingChannelCount}</SingleLine>
            <SingleLine>{closedChannelCount}</SingleLine>
            <SingleLine>{peersCount}</SingleLine>
          </div>
        </Closed>
        <Separation lineColor={unSelectedNavButton} />
        <ReactTooltip id={'full_balance_tip'} place={'right'}>
          {renderLine('Channel Balance', formatCCB)}
          {renderLine('Pending Channel Balance', formatPCB)}
          {renderLine('Chain Balance', formatCB)}
          {renderLine('Pending Chain Balance', formatPB)}
        </ReactTooltip>
        <ReactTooltip id={'full_node_tip'} place={'right'}>
          {renderLine('Active Channels', activeChannelCount)}
          {renderLine('Pending Channels', pendingChannelCount)}
          {renderLine('Closed Channels', closedChannelCount)}
          {renderLine('Peers', peersCount)}
        </ReactTooltip>
      </>
    );
  }

  return (
    <>
      <Title>
        <Alias bottomColor={color} data-tip={`Version: ${version}`}>
          {alias}
        </Alias>
      </Title>
      <Separation lineColor={unSelectedNavButton} />
      <Balance data-tip data-for="balance_tip">
        <Zap size={18} color={channelPending === 0 ? '#FFD300' : '#652EC7'} />
        <Price amount={totalLightning} />
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <Anchor size={18} color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
        <Price amount={totalChain} />
      </Balance>
      <Balance
        data-tip
        data-for="node_tip"
      >{`${activeChannelCount} / ${pendingChannelCount} / ${closedChannelCount} / ${peersCount}`}</Balance>
      <Balance>
        <Info bottomColor={syncedToChain ? '#95de64' : '#ff7875'}>
          {syncedToChain ? 'Synced' : 'Not Synced'}
        </Info>
      </Balance>
      <Separation lineColor={unSelectedNavButton} />
      <ReactTooltip place={'right'} />
      <ReactTooltip id={'balance_tip'} place={'right'}>
        <div>
          {'Channel Balance: '}
          {formatCCB}
        </div>
        <div>
          {'Pending Channel Balance: '}
          {formatPCB}
        </div>
      </ReactTooltip>
      <ReactTooltip id={'chain_balance_tip'} place={'right'}>
        <div>
          {'Chain Balance: '}
          {formatCB}
        </div>
        <div>
          {'Pending Chain Balance: '}
          {formatPB}
        </div>
      </ReactTooltip>
      <ReactTooltip id={'node_tip'} place={'right'}>
        <div>{`Active Channels: ${activeChannelCount}`}</div>
        <div>{`Pending Channels: ${pendingChannelCount}`}</div>
        <div>{`Closed Channels: ${closedChannelCount}`}</div>
        <div>{`Peers: ${peersCount}`}</div>
      </ReactTooltip>
    </>
  );
};
