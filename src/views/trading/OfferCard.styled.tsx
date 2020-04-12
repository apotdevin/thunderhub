import styled from 'styled-components';
import { unSelectedNavButton, mediaWidths } from '../../styles/Themes';
import { ChevronRight } from '../../components/generic/Icons';

export const TradesAmount = styled.div`
  font-size: 14px;
  color: ${unSelectedNavButton};
  margin: 0 4px;
`;

export const StyleArrow = styled(ChevronRight)`
  margin-bottom: -3px;
`;

export const OfferModalBox = styled.div`
  overflow-y: auto;
  max-height: 640px;
  min-height: 240px;
  @media (${mediaWidths.mobile}) {
    max-height: 240px;
    min-height: 120px;
  }
`;

export const StyledTitle = styled.div`
  font-size: 14px;
  margin: 16px 0;

  @media (${mediaWidths.mobile}) {
    text-align: center;
    margin-top: 8px;
  }
`;

export const StyledLogin = styled.div`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledDescription = styled(StyledLogin)`
  max-width: unset;
  overflow-y: auto;
  font-size: 14px;
  max-height: 160px;
`;

export const OptionsLoading = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
