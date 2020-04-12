import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_NODE_INFO } from '../../../graphql/query';
import { useSettings } from '../../../context/SettingsContext';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../../components/generic/Styled';
import {
  QuestionIcon,
  Zap,
  Anchor,
  Circle,
} from '../../../components/generic/Icons';
import { getTooltipType } from '../../../components/generic/Helpers';
import { useAccount } from '../../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { textColorMap, unSelectedNavButton } from '../../../styles/Themes';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { getPrice } from '../../../../src/components/price/Price';
import { AnimatedNumber } from '../../../../src/components/animated/AnimatedNumber';
import { useStatusState } from '../../../context/StatusContext';
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
  font-weight: bold;
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
    syncedToChain,
    chainBalance,
    chainPending,
    channelBalance,
    channelPending,
  } = useStatusState();

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useQuery(GET_NODE_INFO, {
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { theme, currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  const tooltipType = getTooltipType(theme);

  if (loading || !data || !data.getNodeInfo) {
    return (
      <Closed>
        <ScaleLoader height={10} width={2} color={textColorMap[theme]} />
      </Closed>
    );
  }

  const {
    color,
    active_channels_count,
    closed_channels_count,
    alias,
    peers_count,
    pending_channels_count,
    version,
  } = data.getNodeInfo;

  const formatCB = format({ amount: chainBalance });
  const formatPB = format({ amount: chainPending });
  const formatCCB = format({ amount: channelBalance });
  const formatPCB = format({ amount: channelPending });

  if (isBurger) {
    return (
      <>
        <SingleLine>
          <SubTitle>{alias}</SubTitle>
          <Circle
            strokeWidth={'0'}
            fillcolor={syncedToChain ? '#95de64' : '#ff7875'}
          />
        </SingleLine>
        <SingleLine>
          <Sub4Title>Channels</Sub4Title>
          {`${active_channels_count} / ${pending_channels_count} / ${closed_channels_count} / ${peers_count}`}
        </SingleLine>
        <SingleLine>
          <Zap
            color={channelPending === 0 ? '#FFD300' : '#652EC7'}
            fillcolor={channelPending === 0 ? '#FFD300' : '#652EC7'}
          />
          {channelPending > 0 ? (
            `${formatCCB} / ${formatPCB}`
          ) : (
            <AnimatedNumber amount={channelBalance} />
          )}
        </SingleLine>
        <SingleLine>
          <Anchor color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
          {chainPending > 0 ? (
            `${formatCB} / ${formatPB}`
          ) : (
            <AnimatedNumber amount={chainBalance} />
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
              strokeWidth={'0'}
              fillcolor={syncedToChain ? '#95de64' : '#ff7875'}
            />
            {(channelPending > 0 || chainPending > 0) && (
              <div>
                <Circle fillcolor={'#652EC7'} strokeWidth={'0'} />
              </div>
            )}
            <Margin>
              <Zap
                fillcolor={channelPending === 0 ? '#FFD300' : '#652EC7'}
                color={channelPending === 0 ? '#FFD300' : '#652EC7'}
              />
            </Margin>
            <Anchor color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
          </div>
          <div data-tip data-for="full_node_tip">
            <SingleLine>{active_channels_count}</SingleLine>
            <SingleLine>{pending_channels_count}</SingleLine>
            <SingleLine>{closed_channels_count}</SingleLine>
            <SingleLine>{peers_count}</SingleLine>
          </div>
        </Closed>
        <Separation lineColor={unSelectedNavButton} />
        <ReactTooltip
          id={'full_balance_tip'}
          effect={'solid'}
          place={'right'}
          type={tooltipType}
        >
          <div>{`Channel Balance: ${formatCCB}`}</div>
          <div>{`Pending Channel Balance: ${formatPCB}`}</div>
          <div>{`Chain Balance: ${formatCB}`}</div>
          <div>{`Pending Chain Balance: ${formatPB}`}</div>
        </ReactTooltip>
        <ReactTooltip
          id={'full_node_tip'}
          effect={'solid'}
          place={'right'}
          type={tooltipType}
        >
          <div>{`Active Channels: ${active_channels_count}`}</div>
          <div>{`Pending Channels: ${pending_channels_count}`}</div>
          <div>{`Closed Channels: ${closed_channels_count}`}</div>
          <div>{`Peers: ${peers_count}`}</div>
        </ReactTooltip>
      </>
    );
  }

  return (
    <>
      <Title>
        <Alias bottomColor={color}>{alias}</Alias>
        {isOpen && (
          <QuestionIcon data-tip={`Version: ${version.split(' ')[0]}`} />
        )}
      </Title>
      <Separation lineColor={unSelectedNavButton} />
      <Balance data-tip data-for="balance_tip">
        <Zap color={channelPending === 0 ? '#FFD300' : '#652EC7'} />
        <AnimatedNumber amount={channelBalance} />
      </Balance>
      <Balance data-tip data-for="chain_balance_tip">
        <Anchor color={chainPending === 0 ? '#FFD300' : '#652EC7'} />
        <AnimatedNumber amount={chainBalance} />
      </Balance>
      <Balance
        data-tip
        data-for="node_tip"
      >{`${active_channels_count} / ${pending_channels_count} / ${closed_channels_count} / ${peers_count}`}</Balance>
      <Balance>
        <Info bottomColor={syncedToChain ? '#95de64' : '#ff7875'}>
          {syncedToChain ? 'Synced' : 'Not Synced'}
        </Info>
      </Balance>
      <Separation lineColor={unSelectedNavButton} />
      <ReactTooltip effect={'solid'} place={'right'} type={tooltipType} />
      <ReactTooltip
        id={'balance_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Channel Balance: ${formatCCB}`}</div>
        <div>{`Pending Channel Balance: ${formatPCB}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={'chain_balance_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Chain Balance: ${formatCB}`}</div>
        <div>{`Pending Chain Balance: ${formatPB}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={'node_tip'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        <div>{`Active Channels: ${active_channels_count}`}</div>
        <div>{`Pending Channels: ${pending_channels_count}`}</div>
        <div>{`Closed Channels: ${closed_channels_count}`}</div>
        <div>{`Peers: ${peers_count}`}</div>
      </ReactTooltip>
    </>
  );
};
