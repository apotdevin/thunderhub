import styled from 'styled-components';
import {
    cardColor,
    cardBorderColor,
    subCardColor,
    smallLinkColor,
    unSelectedNavButton,
    textColor,
    buttonBorderColor,
    chartLinkColor,
} from '../../styles/Themes';

export const CardWithTitle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const CardTitle = styled.div`
    display: flex;
    justify-content: space-between;
`;

interface CardProps {
    bottom?: string;
    full?: boolean;
    padding?: string;
}

export const Card = styled.div`
    padding: ${({ padding }) => (padding ? padding : '20px')};
    background: ${cardColor};
    box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    border: 1px solid ${cardBorderColor};
    margin-bottom: ${(props: CardProps) => props.bottom};
    width: 100%;
    height: ${(props: CardProps) => props.full && '100%'};
    border-left: ${(props: { color?: string }) =>
        props.color ? `2px solid ${props.color}` : ''};
`;

export const Separation = styled.div`
    height: ${({ height }: { height?: number }) => (height ? height : '2')}px;
    background-color: ${unSelectedNavButton};
    width: 100%;
    margin: 20px 0;
`;

export const SubCard = styled.div`
    margin-bottom: 10px;
    padding: 10px;
    background: ${subCardColor};
    border: 1px solid ${cardBorderColor};
    border-left: ${(props: { color?: string }) =>
        props.color ? `2px solid ${props.color}` : ''};

    &:hover {
        box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    }
`;

export const SmallLink = styled.a`
    text-decoration: none;
    color: ${smallLinkColor};

    &:hover {
        text-decoration: underline;
    }
`;

export const TitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SubTitle = styled.h4`
    margin: 5px 0;
    font-weight: 500;
`;

export const Sub4Title = styled.h5`
    margin: 10px 0;
    font-weight: 500;
`;

export const Input = styled.input`
    height: 30px;
    width: 100%;
    margin: 10px;
    border: 0;
    border-bottom: 2px solid #c8ccd4;
    background: none;
    border-radius: 0;
    color: ${textColor};
    transition: all 0.5s ease;

    &:hover {
        border-bottom: 2px solid
            ${({ color }: { color?: string }) => (color ? color : '#0077ff')};
    }

    &:focus {
        outline: none;
        background: none;
        border-bottom: 2px solid
            ${({ color }: { color?: string }) => (color ? color : '#0077ff')};
    }
`;

export const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SimpleButton = styled.button`
    cursor: pointer;
    outline: none;
    padding: 5px;
    margin: 5px;
    text-decoration: none;
    background-color: transparent;
    color: ${({ enabled = true }: { enabled?: boolean }) =>
        enabled ? textColor : unSelectedNavButton};
    border: 1px solid ${buttonBorderColor};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    white-space: nowrap;
`;

export const DarkSubTitle = styled.div`
    font-size: 14px;
    color: ${unSelectedNavButton};
    margin-bottom: 10px;
`;

export const ColorButton = styled(SimpleButton)`
    color: ${chartLinkColor};

    &:hover {
        border: 1px solid ${({ color }: { color: string }) => color};
        color: ${textColor};
    }
`;
