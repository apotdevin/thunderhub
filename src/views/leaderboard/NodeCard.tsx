import React from 'react';
import { BasePointsType } from 'src/graphql/types';
import styled from 'styled-components';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { themeColors } from 'src/styles/Themes';

type LeaderCardProps = {
  color?: string;
  borderColor?: string;
  borderWidth?: string;
};

const LeaderCard = styled.div<LeaderCardProps>`
  padding: 8px;
  border: ${({ borderWidth }) => borderWidth || '2px'} solid
    ${({ borderColor }) => borderColor || 'gold'};
  background-color: ${({ color }) => color || 'gold'};
  margin: 8px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
`;

const NumberPadding = styled.div`
  margin-right: 8px;
`;

const getBorderColor = (index: number) => {
  switch (index) {
    case 1:
      return 'gold';
    case 2:
      return 'orange';
    case 3:
      return 'white';
    default:
      return themeColors.blue2;
  }
};

const getColor = (index: number) => {
  switch (index) {
    case 1:
    case 2:
    case 3:
    default:
      return 'transparent';
  }
};

const getWidth = (index: number): string => {
  switch (index) {
    case 1:
    case 2:
    case 3:
      return '2px';
    default:
      return '1px';
  }
};

type NodeCardType = {
  node: BasePointsType | null;
  index: number;
};

export const NodeCard = ({ node, index }: NodeCardType) => {
  if (!node) return null;
  return (
    <LeaderCard
      color={getColor(index)}
      borderColor={getBorderColor(index)}
      borderWidth={getWidth(index)}
    >
      <Line>
        <NumberPadding>{`${index}.`}</NumberPadding>
        {node.alias}
      </Line>
      <Line>
        <DarkSubTitle withMargin={'0 8px 0 0'}>Points:</DarkSubTitle>
        {node.amount}
      </Line>
    </LeaderCard>
  );
};
