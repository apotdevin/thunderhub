import { Heart } from 'lucide-react';
import styled from 'styled-components';
import {
  chartColors,
  cardColor,
  cardBorderColor,
  unSelectedNavButton,
  mediaWidths,
} from '../../../../styles/Themes';

const QuickTitle = styled.div`
  font-size: 12px;
  color: ${unSelectedNavButton};
  margin-top: 10px;
`;

const QuickCard = styled.div`
  background: ${cardColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid ${cardBorderColor};
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: #69c0ff;

  @media (${mediaWidths.mobile}) {
    padding: 4px;
    height: 80px;
    width: 80px;
  }

  &:hover {
    background-color: ${chartColors.green};
    color: white;

    & ${QuickTitle} {
      color: white;
    }
  }
`;

type SupportCardProps = {
  callback: () => void;
};

export const SupportCard = ({ callback }: SupportCardProps) => {
  return (
    <QuickCard onClick={callback}>
      <Heart size={24} />
      <QuickTitle>Donate</QuickTitle>
    </QuickCard>
  );
};
