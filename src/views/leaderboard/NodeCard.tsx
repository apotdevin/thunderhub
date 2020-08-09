import React from 'react';
import { BasePointsType } from 'src/graphql/types';
import styled from 'styled-components';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { themeColors } from 'src/styles/Themes';

type LeaderCardProps = {
  color?: string;
  borderColor?: string;
};

const LeaderCard = styled.div<LeaderCardProps>`
  padding: 8px;
  border: 2px solid ${({ borderColor }) => borderColor || 'gold'};
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
      return '#D4AF37';
    case 2:
      return '#CD7F32';
    case 3:
      return '#C0C0C0';
    default:
      return 'transparent';
  }
};

type NodeCardType = {
  node: BasePointsType | null;
  index: number;
};

export const NodeCard = ({ node, index }: NodeCardType) => {
  if (!node) return null;
  return (
    <LeaderCard color={getColor(index)} borderColor={getBorderColor(index)}>
      <div>{node.alias}</div>
      <Line>
        <DarkSubTitle>Points:</DarkSubTitle>
        {node.amount}
      </Line>
    </LeaderCard>
  );
};
