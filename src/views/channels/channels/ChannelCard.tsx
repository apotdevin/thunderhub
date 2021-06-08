import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  ChevronsUp,
  ChevronsDown,
  X,
} from 'react-feather';
import { ChannelType } from 'src/graphql/types';
import {
  useRebalanceState,
  useRebalanceDispatch,
} from 'src/context/RebalanceContext';
import differenceInDays from 'date-fns/differenceInDays';
import { MainInfo } from '../../../components/generic/CardGeneric';
import { SubCard, DarkSubTitle } from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import { renderLine } from '../../../components/generic/helpers';
import { getPrice } from '../../../components/price/Price';
import { usePriceState } from '../../../context/PriceContext';
import {
  ChannelNodeTitle,
  ChannelBarSide,
  ChannelIconPadding,
  ChannelSingleLine,
  ChannelBalanceRow,
  ChannelBalanceButton,
  ChannelAlias,
  LineGrid,
} from './Channel.style';
import { getColumnTemplate, getTitleColor } from './helpers';
import { ChannelDetails } from './ChannelDetails';
import { ChannelBars } from './ChannelBars';
import { ChannelBarsInfo } from './ChannelBarsInfo';

const getSymbol = (status: boolean) => {
  return status ? <ArrowDown size={14} /> : <ArrowUp size={14} />;
};

const getPrivate = (status: boolean) => {
  return status && <EyeOff size={14} />;
};

interface ChannelCardProps {
  channelInfo: ChannelType;
  index: number;
  setIndexOpen: (indexNumber: number) => void;
  indexOpen: number;
  biggest: number;
  biggestPartner: number;
  mostChannels: number;
  biggestBaseFee: number;
  biggestRateFee: number;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
  biggest,
  biggestPartner,
  mostChannels,
  biggestBaseFee,
  biggestRateFee,
}) => {
  const dispatch = useRebalanceDispatch();
  const { inChannel, outChannel } = useRebalanceState();

  const { channelBarStyle, extraColumns } = useConfigState();

  const showIncoming = extraColumns === 'incoming' || extraColumns === 'both';
  const showOutgoing = extraColumns === 'outgoing' || extraColumns === 'both';

  const template = getColumnTemplate(extraColumns);

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const {
    capacity,
    id,
    is_active,
    is_closing,
    is_opening,
    is_partner_initiated,
    is_private,
    partner_public_key,
    partner_node_info,
    partner_fee_info,
    bosScore,
  } = channelInfo;

  const fee_rate = partner_fee_info?.partner_node_policies?.fee_rate;

  const node_rate = partner_fee_info?.node_policies?.fee_rate;

  const barDetails = {
    biggestRateFee,
    biggestBaseFee,
    biggestPartner,
    mostChannels,
    biggest,
  };

  let withinAWeek = false;

  if (bosScore?.updated) {
    withinAWeek = differenceInDays(new Date(), new Date(bosScore.updated)) < 7;
  }

  const isBosNode = !!bosScore?.alias && withinAWeek;

  const isIn = inChannel?.id === id;
  const isOut = outChannel?.id === id;

  const { alias } = partner_node_info?.node || {};

  const formatBalance = format({ amount: capacity });

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const getSubCardProps = () => {
    switch (channelBarStyle) {
      case 'ultracompact':
      case 'balancing':
        return {
          withMargin: '0 0 4px 0',
          padding: index === indexOpen ? '0 0 16px' : '2px 0',
          noBackground: true,
        };
      case 'compact':
        return {
          withMargin: '0 0 4px 0',
          padding: index === indexOpen ? '4px 8px 16px' : '4px 8px',
        };
      default:
        return {};
    }
  };

  return (
    <SubCard key={`${index}-${id}`} noCard={true} {...getSubCardProps()}>
      <MainInfo
        disabled={channelBarStyle === 'balancing'}
        onClick={() => channelBarStyle !== 'balancing' && handleClick()}
      >
        <LineGrid template={template}>
          <ChannelNodeTitle
            style={{ flexGrow: 2 }}
            data-tip
            data-for={`node_status_tip_${index}`}
          >
            <ChannelAlias
              textColor={getTitleColor(
                is_active,
                is_opening,
                is_closing,
                isBosNode
              )}
            >
              {alias || partner_public_key?.substring(0, 6)}
            </ChannelAlias>
            {!(
              channelBarStyle === 'ultracompact' ||
              channelBarStyle === 'balancing'
            ) && (
                <ChannelSingleLine>
                  <DarkSubTitle>{formatBalance}</DarkSubTitle>
                  <ChannelIconPadding>
                    {getPrivate(is_private)}
                    {getSymbol(is_partner_initiated)}
                  </ChannelIconPadding>
                </ChannelSingleLine>
              )}
          </ChannelNodeTitle>
          {showOutgoing ? (
            <ChannelSingleLine>
              <DarkSubTitle>{`${node_rate || '-'} ppm`}</DarkSubTitle>
            </ChannelSingleLine>
          ) : null}
          <ChannelBarSide data-tip data-for={`node_balance_tip_${index}`}>
            <ChannelBars
              info={channelInfo}
              details={barDetails}
              format={format}
            />
            {channelBarStyle === 'balancing' && (
              <ChannelBalanceRow>
                <ChannelBalanceButton
                  selected={isOut}
                  disabled={isIn}
                  onClick={() =>
                    isOut
                      ? dispatch({ type: 'setOut', channel: null })
                      : dispatch({ type: 'setOut', channel: channelInfo })
                  }
                >
                  {isOut ? <X size={16} /> : <ChevronsUp size={16} />}
                </ChannelBalanceButton>
                <ChannelBalanceButton
                  selected={isIn}
                  disabled={isOut}
                  onClick={() =>
                    isIn
                      ? dispatch({ type: 'setIn', channel: null })
                      : dispatch({ type: 'setIn', channel: channelInfo })
                  }
                >
                  {isIn ? <X size={16} /> : <ChevronsDown size={16} />}
                </ChannelBalanceButton>
              </ChannelBalanceRow>
            )}
          </ChannelBarSide>
          {showIncoming ? (
            <ChannelSingleLine>
              <DarkSubTitle>{`${fee_rate || '-'} ppm`}</DarkSubTitle>
            </ChannelSingleLine>
          ) : null}
        </LineGrid>
      </MainInfo>
      {index === indexOpen && (
        <ChannelDetails info={channelInfo} format={format} />
      )}
      <ReactTooltip
        id={`node_status_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {isBosNode && renderLine('BOS Node', 'True')}
        {renderLine('Status:', is_active ? 'Active' : 'Not Active')}
        {is_opening && renderLine('Is Opening:', 'True')}
        {is_closing && renderLine('Is Closing:', 'True')}
      </ReactTooltip>
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        <ChannelBarsInfo info={channelInfo} format={format} />
      </ReactTooltip>
    </SubCard>
  );
};
