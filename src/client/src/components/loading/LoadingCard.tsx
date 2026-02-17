import { Loader2 } from 'lucide-react';
import styled from 'styled-components';
import { CardWithTitle, CardTitle, SubTitle, Card } from '../generic/Styled';
import { themeColors } from '../../styles/Themes';

const Loading = styled.div<{ loadingHeight?: string }>`
  width: 100%;
  height: ${({ loadingHeight }) => (loadingHeight ? loadingHeight : 'auto')};
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
  inverseColor?: boolean;
}

export const LoadingCard = ({
  title = '',
  color,
  noCard = false,
  noTitle = false,
  loadingHeight,
  inverseColor,
}: LoadingCardProps) => {
  const loadingColor = color ? color : themeColors.blue3;

  if (noCard) {
    return (
      <Loading loadingHeight={loadingHeight}>
        <Loader2
          className="animate-spin"
          size={20}
          style={{ color: loadingColor }}
        />
      </Loading>
    );
  }

  if (noTitle) {
    return (
      <Card>
        <Loading loadingHeight={loadingHeight}>
          <Loader2
            className="animate-spin"
            size={20}
            style={{ color: loadingColor }}
          />
        </Loading>
      </Card>
    );
  }

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle inverseColor={inverseColor}>{title}</SubTitle>
      </CardTitle>
      <Card>
        <Loading loadingHeight={loadingHeight}>
          <Loader2
            className="animate-spin"
            size={20}
            style={{ color: loadingColor }}
          />
        </Loading>
      </Card>
    </CardWithTitle>
  );
};
