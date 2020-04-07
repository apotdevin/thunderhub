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

export const StyledTitle = styled.div`
    font-size: 14px;
    @media (${mediaWidths.mobile}) {
        text-align: center;
        margin-top: 8px;
    }
`;

export const StyledLogin = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;
`;

export const StyledDescription = styled(StyledLogin)`
    font-size: 14px;

    @media (${mediaWidths.mobile}) {
        max-height: 160px;
        overflow-y: auto;
    }
`;
