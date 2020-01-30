import styled from 'styled-components';
import { SingleLine } from 'components/generic/Styled';
import { headerColor } from 'styles/Themes';

export const Padding = styled.div`
    padding: 4px 4px 0 0;
`;

export const SlantedWrapper = styled.div`
    width: 100%;
    height: 200px;
    margin-bottom: -260px;
    overflow: hidden;
    z-index: -5;
`;

export const SlantedEdge = styled.div`
    content: '';
    width: 100%;
    height: 100%;
    background: ${headerColor};
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(84deg);
    -ms-transform: skew(84deg);
    transform: skew(88deg);
    z-index: -5;
`;

export const FullWidth = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 18px;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: stretch;

    @media (max-width: 578px) {
        flex-direction: ${({ reverse }: { reverse?: boolean }) =>
            reverse ? 'column-reverse' : 'column'};
    }
`;

export const HalfSection = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;

    @media (max-width: 578px) {
        width: 100%;
        text-align: center;
    }
`;

export const ImageSection = styled(HalfSection)`
    align-self: center;
`;

export const TextSection = styled(HalfSection)`
    padding: 0 32px;

    @media (max-width: 578px) {
        padding: 0 8px;
    }
`;

export const ImagePlace = styled.img`
    display: flex;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    background-color: grey;
`;

export const WrapSingleLine = styled(SingleLine)`
    flex-wrap: wrap;
    justify-content: space-around;
    flex-grow: 1;
`;
