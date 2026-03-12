import { Zap, Anchor, Circle } from 'lucide-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { getPrice, Price } from '../../../components/price/Price';
import { addEllipsis, renderLine } from '../../../components/generic/helpers';
import { useNodeInfo } from '../../../hooks/UseNodeInfo';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';

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
    currentBlockHeight,
    activeChannelCount,
    pendingChannelCount,
    closedChannelCount,
    peersCount,
    latestBlockHeight,
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

  const syncPercentage =
    !!latestBlockHeight && currentBlockHeight > 0
      ? Math.min(Math.round((currentBlockHeight / latestBlockHeight) * 100), 99)
      : null;

  const syncText = syncedToChain
    ? 'Synced'
    : !!syncPercentage
      ? `Chain syncing... (${syncPercentage}%)`
      : 'Chain syncing...';

  const syncColor = syncedToChain ? '#95de64' : '#ff7875';

  if (!alias) return null;

  if (isBurger) {
    return (
      <>
        <SingleLine>
          <SubTitle>{addEllipsis(alias)}</SubTitle>
          <Circle size={18} strokeWidth={'0'} fill={syncColor} />
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
        <div className="flex justify-center items-center flex-col w-full">
          <div data-tip data-for="full_balance_tip">
            <Circle size={18} strokeWidth={'0'} fill={syncColor} />
            {(channelPending > 0 || chainPending > 0) && (
              <div>
                <Circle size={18} fill={'#652EC7'} strokeWidth={'0'} />
              </div>
            )}
            <div className="mt-2 mb-0.5">
              <Zap
                size={18}
                fill={channelPending === 0 ? '#FFD300' : '#652EC7'}
                color={channelPending === 0 ? '#FFD300' : '#652EC7'}
              />
            </div>
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
        </div>
        <Separation lineColor={'grey'} />
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
      <div className="text-lg font-bold flex justify-center items-center">
        <div
          className="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden"
          style={{ borderBottom: `2px solid ${color}` }}
          data-tip={`Version: ${version}`}
        >
          {alias}
        </div>
      </div>
      <Separation lineColor={'grey'} />
      <div
        className="flex justify-center items-center my-0.5 px-[5px] cursor-default"
        data-tip
        data-for="balance_tip"
      >
        <Zap size={18} color={channelPending === 0 ? '#FFD300' : '#652EC7'} />
        <Price amount={totalLightning} />
      </div>
      <div
        className="flex justify-center items-center my-0.5 px-[5px] cursor-default"
        data-tip
        data-for="chain_balance_tip"
      >
        <Anchor size={18} color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
        <Price amount={totalChain} />
      </div>
      <div
        className="flex justify-center items-center my-0.5 px-[5px] cursor-default"
        data-tip
        data-for="node_tip"
      >{`${activeChannelCount} / ${pendingChannelCount} / ${closedChannelCount} / ${peersCount}`}</div>
      <div className="flex justify-center items-center my-0.5 px-[5px] cursor-default">
        <div style={{ width: '100%' }}>
          <div
            className="text-sm text-[#bfbfbf]"
            style={{
              borderBottom: `2px solid ${syncedToChain ? syncColor : 'transparent'}`,
            }}
          >
            {syncText}
          </div>
          {!!syncPercentage && (
            <div className="w-full h-1.5 bg-[#3a3a3a] rounded-[3px] mt-1.5 overflow-hidden border border-[#555]">
              <div
                className="h-full rounded-[2px] transition-[width] duration-300 ease-in-out"
                style={{
                  width: `${Math.min(Math.max(syncPercentage, 0), 100)}%`,
                  backgroundColor: syncColor,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Separation lineColor={'grey'} />
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
