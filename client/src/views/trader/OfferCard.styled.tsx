import styled from 'styled-components';
import { unSelectedNavButton, mediaWidths } from 'styles/Themes';
import { ChevronRight } from 'components/generic/Icons';

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
