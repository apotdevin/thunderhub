import styled from 'styled-components';
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
  align-items: center;
  max-width: 300px;

  @media (${mediaWidths.mobile}) {
    max-width: unset;
    justify-content: center;
    width: 100%;
    padding-bottom: 8px;
  }
`;
