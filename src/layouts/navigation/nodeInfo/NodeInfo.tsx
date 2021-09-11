import React from 'react';
import { Zap, Anchor, Circle } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { getPrice, Price } from 'src/components/price/Price';
import { addEllipsis, renderLine } from 'src/components/generic/helpers';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import { useNodeBalances } from 'src/hooks/UseNodeBalances';
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
            color={Number(lightning.pending) === 0 ? '#FFD300' : '#652EC7'}
            fill={Number(lightning.pending) === 0 ? '#FFD300' : '#652EC7'}
          />
          {Number(lightning.pending) > 0 ? (
            <>
              {formatCCB}
              {' / '}
              {formatPCB}
            </>
          ) : (
            <Price amount={lightning.confirmed} />
          )}
        </SingleLine>
        <SingleLine>
          <Anchor
            size={18}
            color={Number(onchain.pending) === 0 ? '#FFD300' : '#652EC7'}
          />
          {Number(onchain.pending) > 0 ? (
            <>
              {formatCB}
              {' / '}
              {formatPB}
            </>
          ) : (
            <Price amount={onchain.confirmed} />
          )}
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
            {(Number(lightning.pending) > 0 || Number(onchain.pending) > 0) && (
              <div>
                <Circle size={18} fill={'#652EC7'} strokeWidth={'0'} />
              </div>
            )}
            <Margin>
              <Zap
                size={18}
                fill={Number(lightning.pending) === 0 ? '#FFD300' : '#652EC7'}
                color={Number(lightning.pending) === 0 ? '#FFD300' : '#652EC7'}
              />
            </Margin>
            <Anchor
              size={18}
              color={Number(onchain.pending) === 0 ? '#FFD300' : '#652EC7'}
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
        <ReactTooltip id={'full_balance_tip'} effect={'solid'} place={'right'}>
          {renderLine('Channel Balance', formatCCB)}
          {renderLine('Pending Channel Balance', formatPCB)}
          {renderLine('Chain Balance', formatCB)}
          {renderLine('Pending Chain Balance', formatPB)}
        </ReactTooltip>
        <ReactTooltip id={'full_node_tip'} effect={'solid'} place={'right'}>
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
          {addEllipsis(alias)}
        </Alias>
      </Title>
      <Separation lineColor={unSelectedNavButton} />
      <Balance data-tip data-for="balance_tip">
        <Zap
          size={18}
          color={Number(lightning.pending) === 0 ? '#FFD300' : '#652EC7'}
        />
        <Price amount={lightning.confirmed} />
        {/* <AnimatedNumber amount={channelBalance} /> */}
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <Anchor
          size={18}
          color={Number(onchain.pending) === 0 ? '#FFD300' : '#652EC7'}
        />
        <Price amount={onchain.confirmed} />
        {/* <AnimatedNumber amount={chainBalance} /> */}
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
      <ReactTooltip effect={'solid'} place={'right'} />
      <ReactTooltip id={'balance_tip'} effect={'solid'} place={'right'}>
        <div>
          {'Channel Balance: '}
          {formatCCB}
        </div>
        <div>
          {'Pending Channel Balance: '}
          {formatPCB}
        </div>
      </ReactTooltip>
      <ReactTooltip id={'chain_balance_tip'} effect={'solid'} place={'right'}>
        <div>
          {'Chain Balance: '}
          {formatCB}
        </div>
        <div>
          {'Pending Chain Balance: '}
          {formatPB}
        </div>
      </ReactTooltip>
      <ReactTooltip id={'node_tip'} effect={'solid'} place={'right'}>
        <div>{`Active Channels: ${activeChannelCount}`}</div>
        <div>{`Pending Channels: ${pendingChannelCount}`}</div>
        <div>{`Closed Channels: ${closedChannelCount}`}</div>
        <div>{`Peers: ${peersCount}`}</div>
      </ReactTooltip>
    </>
  );
};
