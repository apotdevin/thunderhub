import styled from 'styled-components';
import { SubCard, SingleLine } from 'src/components/generic/Styled';
import { mediaWidths, themeColors } from '../../styles/Themes';

export const HopCard = styled.div`
  margin-left: 16px;
`;

export const CardPadding = styled.div`
  @media (${mediaWidths.mobile}) {
    padding: 16px 0;
  }
`;

export const Padding = styled.div`
  padding-right: 8px;
`;

export const CirclePadding = styled(Padding)`
  display: flex;
  align-items: center;
`;

export const ChannelColumnSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;

  @media (${mediaWidths.mobile}) {
    min-width: unset;
    width: 100%;
  }
`;

export const ChannelLineSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;

  @media (${mediaWidths.mobile}) {
    align-items: center;
    max-width: unset;
    justify-content: center;
    width: 100%;
    padding-bottom: 8px;
  }
`;

export const FullWidthSubCard = styled(SubCard)`
  width: 100%;
  align-self: stretch;
`;

export const WithSpaceSubCard = styled(FullWidthSubCard)`
  margin-right: 12px;

  @media (${mediaWidths.mobile}) {
    margin-right: 0;
  }
`;

export const RebalanceTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

export const RebalanceTag = styled.div`
  padding: 2px 8px;
  border: 1px solid ${themeColors.blue2};
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;

  @media (${mediaWidths.mobile}) {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const RebalanceLine = styled(SingleLine)`
  margin-bottom: 8px;
`;

export const RebalanceWrapLine = styled(SingleLine)`
  flex-wrap: wrap;
`;

export const RebalanceSubTitle = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;
