import styled from 'styled-components';
import {
  cardBorderColor,
  cardColor,
  mediaWidths,
  unSelectedNavButton,
} from '../../../../styles/Themes';
import { GhostLogo } from '../../../../components/logo/GhostIcon';
import { useRouter } from 'next/router';

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
    background-color: black;
    color: white;

    & ${QuickTitle} {
      color: white;
    }
  }
`;

export const GhostCard = () => {
  const { push } = useRouter();

  return (
    <QuickCard onClick={() => push('/amboss')}>
      <GhostLogo size={24} />
      <QuickTitle>Ghost</QuickTitle>
    </QuickCard>
  );
};
