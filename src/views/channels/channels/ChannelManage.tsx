import * as React from 'react';
import {
  SingleButton,
  MultiButton,
} from 'src/components/buttons/multiButton/MultiButton';
import {
  useConfigState,
  useConfigDispatch,
  channelBarStyleTypes,
  channelBarTypeTypes,
  channelSortTypes,
  sortDirectionTypes,
  extraColumnsType,
  maxSatValueType,
} from 'src/context/ConfigContext';
import {
  Card,
  Sub4Title,
  ResponsiveLine,
  Separation,
  SingleLine,
} from 'src/components/generic/Styled';
import styled from 'styled-components';
import { DetailsChange } from 'src/components/details/detailsChange';
import { OpenChannel } from 'src/views/home/quickActions/openChannel';
import { X } from 'react-feather';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';

const MarginLine = styled(ResponsiveLine)`
  margin: 8px 0;
`;

export const ChannelManage = () => {
  const [openWindow, setOpenWindow] = React.useState<string>('none');
  const {
    channelBarType,
    channelBarStyle,
    channelSort,
    sortDirection,
    extraColumns,
    maxSatValue,
  } = useConfigState();
  const dispatch = useConfigDispatch();

  const changeStyle = (style: channelBarStyleTypes) =>
    dispatch({ type: 'change', channelBarStyle: style });
  const changeType = (type: channelBarTypeTypes) =>
    dispatch({ type: 'change', channelBarType: type });
  const changeSub = (type: extraColumnsType) =>
    dispatch({ type: 'change', extraColumns: type });
  const changeSort = (type: channelSortTypes) =>
    dispatch({ type: 'change', channelSort: type });
  const changeDirection = (type: sortDirectionTypes) =>
    dispatch({ type: 'change', sortDirection: type });
  const changeMaxValue = (type: maxSatValueType) =>
    dispatch({ type: 'change', maxSatValue: type });

  const renderOpenButton = () => (
    <SingleLine>
      <Sub4Title>Open Channel</Sub4Title>
      <ColorButton
        arrow={openWindow !== 'open'}
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'open' : 'none'))
        }
      >
        {openWindow === 'open' ? <X size={16} /> : 'Open'}
      </ColorButton>
    </SingleLine>
  );

  const renderDetailsButton = () => (
    <SingleLine>
      <Sub4Title>Change Channel Details</Sub4Title>
      <ColorButton
        withMargin={'8px 0 0'}
        arrow={openWindow !== 'details'}
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'details' : 'none'))
        }
      >
        {openWindow === 'details' ? <X size={16} /> : 'Change'}
      </ColorButton>
    </SingleLine>
  );

  const renderContent = () => {
    switch (openWindow) {
      case 'open':
        return (
          <>
            {renderOpenButton()}
            <Separation />
            <OpenChannel setOpenCard={() => setOpenWindow('none')} />
          </>
        );
      case 'details':
        return (
          <>
            {renderDetailsButton()}
            <Separation />
            <DetailsChange />
          </>
        );
      default:
        return (
          <>
            {renderOpenButton()}
            {renderDetailsButton()}
            <Separation />
            <MarginLine>
              <Sub4Title>Card Type</Sub4Title>
              <MultiButton>
                <SingleButton
                  selected={channelBarStyle === 'normal'}
                  onClick={() => changeStyle('normal')}
                >
                  Normal
                </SingleButton>
                <SingleButton
                  selected={channelBarStyle === 'compact'}
                  onClick={() => changeStyle('compact')}
                >
                  Compact
                </SingleButton>
                <SingleButton
                  selected={channelBarStyle === 'ultracompact'}
                  onClick={() => changeStyle('ultracompact')}
                >
                  Ultra-Compact
                </SingleButton>
                <SingleButton
                  selected={channelBarStyle === 'balancing'}
                  onClick={() => changeStyle('balancing')}
                >
                  Balancing
                </SingleButton>
              </MultiButton>
            </MarginLine>
            <MarginLine>
              <Sub4Title>Bar Types</Sub4Title>
              <MultiButton>
                <SingleButton
                  selected={channelBarType === 'balance'}
                  onClick={() => changeType('balance')}
                >
                  Balance
                </SingleButton>
                <SingleButton
                  selected={channelBarType === 'proportional'}
                  onClick={() => changeType('proportional')}
                >
                  Proportional
                </SingleButton>
                <SingleButton
                  selected={channelBarType === 'size'}
                  onClick={() => changeType('size')}
                >
                  Partner Size
                </SingleButton>
                <SingleButton
                  selected={channelBarType === 'fees'}
                  onClick={() => changeType('fees')}
                >
                  Fees
                </SingleButton>
                <SingleButton
                  selected={channelBarType === 'htlcs'}
                  onClick={() => changeType('htlcs')}
                >
                  HTLC
                </SingleButton>
              </MultiButton>
            </MarginLine>
            {channelBarType === 'proportional' && (
              <MarginLine>
                <Sub4Title>Max Sat Value</Sub4Title>
                <MultiButton>
                  <SingleButton
                    selected={maxSatValue === 16777215}
                    onClick={() => changeMaxValue(16777215)}
                  >
                    Wumbo (16m)
                  </SingleButton>
                  <SingleButton
                    selected={maxSatValue === 10000000}
                    onClick={() => changeMaxValue(10000000)}
                  >
                    10m
                  </SingleButton>
                  <SingleButton
                    selected={maxSatValue === 5000000}
                    onClick={() => changeMaxValue(5000000)}
                  >
                    5m
                  </SingleButton>
                  <SingleButton
                    selected={maxSatValue === 1000000}
                    onClick={() => changeMaxValue(1000000)}
                  >
                    1m
                  </SingleButton>
                  <SingleButton
                    selected={maxSatValue === 'auto'}
                    onClick={() => changeMaxValue('auto')}
                  >
                    Auto
                  </SingleButton>
                </MultiButton>
              </MarginLine>
            )}
            {(channelBarType === 'proportional' ||
              channelBarType === 'balance') && (
              <MarginLine>
                <Sub4Title>Fee Rate</Sub4Title>
                <MultiButton>
                  <SingleButton
                    selected={extraColumns === 'outgoing'}
                    onClick={() => changeSub('outgoing')}
                  >
                    Outgoing
                  </SingleButton>
                  <SingleButton
                    selected={extraColumns === 'incoming'}
                    onClick={() => changeSub('incoming')}
                  >
                    Incoming
                  </SingleButton>
                  <SingleButton
                    selected={extraColumns === 'both'}
                    onClick={() => changeSub('both')}
                  >
                    Both
                  </SingleButton>
                  <SingleButton
                    selected={extraColumns === 'none'}
                    onClick={() => changeSub('none')}
                  >
                    None
                  </SingleButton>
                </MultiButton>
              </MarginLine>
            )}
            <MarginLine>
              <Sub4Title>Sort</Sub4Title>
              <MultiButton>
                <SingleButton
                  selected={channelSort === 'none'}
                  onClick={() => changeSort('none')}
                >
                  None
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'age'}
                  onClick={() => changeSort('age')}
                >
                  Age
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'local'}
                  onClick={() => changeSort('local')}
                >
                  Local
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'balance'}
                  onClick={() => changeSort('balance')}
                >
                  Balance
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'deviation'}
                  onClick={() => changeSort('deviation')}
                >
                  Deviation
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'feeRate'}
                  onClick={() => changeSort('feeRate')}
                >
                  Fee Rate
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'partnerName'}
                  onClick={() => changeSort('partnerName')}
                >
                  Name
                </SingleButton>
                <SingleButton
                  selected={channelSort === 'size'}
                  onClick={() => changeSort('size')}
                >
                  Size
                </SingleButton>
              </MultiButton>
            </MarginLine>
            {channelSort !== 'none' && (
              <MarginLine>
                <Sub4Title>Direction</Sub4Title>
                <MultiButton>
                  <SingleButton
                    selected={sortDirection === 'increase'}
                    onClick={() => changeDirection('increase')}
                  >
                    Increasing
                  </SingleButton>
                  <SingleButton
                    selected={sortDirection === 'decrease'}
                    onClick={() => changeDirection('decrease')}
                  >
                    Decreasing
                  </SingleButton>
                </MultiButton>
              </MarginLine>
            )}
          </>
        );
    }
  };

  return <Card>{renderContent()}</Card>;
};
