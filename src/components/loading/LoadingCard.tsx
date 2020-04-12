import React from 'react';
import { CardWithTitle, CardTitle, SubTitle, Card } from '../generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import styled from 'styled-components';
import { themeColors } from '../../styles/Themes';

const Loading = styled.div`
  width: 100%;
  height: ${({ loadingHeight }: { loadingHeight?: string }) =>
    loadingHeight ? loadingHeight : 'auto'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LoadingCardProps {
  title?: string;
  noCard?: boolean;
  color?: string;
  noTitle?: boolean;
  loadingHeight?: string;
}

export const LoadingCard = ({
  title = '',
  color,
  noCard = false,
  noTitle = false,
  loadingHeight,
}: LoadingCardProps) => {
  const loadingColor = color ? color : themeColors.blue3;

  if (noCard) {
    return (
      <Loading loadingHeight={loadingHeight}>
        <ScaleLoader height={20} color={loadingColor} />
      </Loading>
    );
  }

  if (noTitle) {
    return (
      <Card>
        <Loading loadingHeight={loadingHeight}>
          <ScaleLoader height={20} color={loadingColor} />
        </Loading>
      </Card>
    );
  }

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>{title}</SubTitle>
      </CardTitle>
      <Card>
        <Loading loadingHeight={loadingHeight}>
          <ScaleLoader height={20} color={loadingColor} />
        </Loading>
      </Card>
    </CardWithTitle>
  );
};
