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
} from 'src/context/ConfigContext';
import { Card, Sub4Title, ResponsiveLine } from 'src/components/generic/Styled';
import styled from 'styled-components';

const MarginLine = styled(ResponsiveLine)`
  margin: 8px 0;
`;

export const ChannelManage = () => {
  const {
    channelBarType,
    channelBarStyle,
    channelSort,
    sortDirection,
  } = useConfigState();
  const dispatch = useConfigDispatch();

  const changeStyle = (style: channelBarStyleTypes) =>
    dispatch({ type: 'change', channelBarStyle: style });
  const changeType = (type: channelBarTypeTypes) =>
    dispatch({ type: 'change', channelBarType: type });
  const changeSort = (type: channelSortTypes) =>
    dispatch({ type: 'change', channelSort: type });
  const changeDirection = (type: sortDirectionTypes) =>
    dispatch({ type: 'change', sortDirection: type });

  return (
    <Card>
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
            Partner Fees
          </SingleButton>
        </MultiButton>
      </MarginLine>
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
    </Card>
  );
};
