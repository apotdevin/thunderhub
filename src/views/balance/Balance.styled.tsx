import styled from 'styled-components';
import { SubCard } from 'src/components/generic/Styled';
import { mediaWidths } from '../../styles/Themes';

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
