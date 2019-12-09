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
    inverseTextColor,
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
    margin-bottom: ${({ bottom }: CardProps) => (bottom ? bottom : '25px')};
    width: 100%;
    height: ${(props: CardProps) => props.full && '100%'};
    border-left: ${(props: { color?: string }) =>
        props.color ? `2px solid ${props.color}` : ''};
`;

interface SeparationProps {
    height?: number;
}

export const Separation = styled.div`
    height: ${({ height }: SeparationProps) => (height ? height : '1')}px;
    background-color: ${unSelectedNavButton};
    width: 100%;
    margin: 20px 0;
`;

interface SubCardProps {
    color?: string;
    padding?: string;
}

export const SubCard = styled.div`
    margin-bottom: 10px;
    padding: ${({ padding }) => (padding ? padding : '10px')};
    background: ${subCardColor};
    border: 1px solid ${cardBorderColor};
    border-left: ${({ color }: SubCardProps) =>
        color ? `2px solid ${color}` : ''};

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

export const InverseSubtitle = styled(SubTitle)`
    color: ${inverseTextColor};
`;

export const Sub4Title = styled.h5`
    margin: 10px 0;
    font-weight: 500;
`;

export const NoWrapTitle = styled(Sub4Title)`
    white-space: nowrap;
`;

export const Input = styled.input`
    padding: 5px;
    height: 30px;
    width: 80%;
    margin: 10px;
    border: 0;
    border: 1px solid #c8ccd4;
    background: none;
    border-radius: 0;
    color: ${textColor};
    transition: all 0.5s ease;

    &:hover {
        border: 1px solid
            ${({ color }: { color?: string }) => (color ? color : '#0077ff')};
    }

    &:focus {
        outline: none;
        background: none;
        border: 1px solid
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

export const SimpleInverseButton = styled(SimpleButton)`
    color: ${({ enabled = true }: { enabled?: boolean }) =>
        enabled ? inverseTextColor : unSelectedNavButton};
`;

interface DarkProps {
    fontSize?: string;
    bottom?: string;
}

export const DarkSubTitle = styled.div`
    font-size: ${({ fontSize }: DarkProps) => (fontSize ? fontSize : '14px')};
    color: ${unSelectedNavButton};
    margin-bottom: ${({ bottom }: DarkProps) => (bottom ? bottom : '10px')};
`;

export const ColorButton = styled(SimpleButton)`
    color: ${chartLinkColor};

    &:hover {
        border: 1px solid ${({ color }: { color: string }) => color};
        color: ${textColor};
    }
`;
