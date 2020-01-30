import styled, { css } from 'styled-components';
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

export interface CardProps {
    bottom?: string;
    padding?: string;
}

export const Card = styled.div`
    padding: ${({ padding }) => (padding ? padding : '16px')};
    background: ${cardColor};
    box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid ${cardBorderColor};
    margin-bottom: ${({ bottom }: CardProps) => (bottom ? bottom : '25px')};
    width: 100%;
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
    padding: ${({ padding }) => (padding ? padding : '16px')};
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

export const SubTitle = styled.h4`
    margin: 5px 0;
    font-weight: ${({ fontWeight }: { fontWeight?: string }) =>
        fontWeight ? fontWeight : '500'};
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

export const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const RightAlign = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export const ColumnLine = styled.div`
    display: flex;
    flex-direction: column;

    @media (max-width: 578px) {
        width: 100%;
    }
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
    margin-bottom: ${({ bottom }: DarkProps) => (bottom ? bottom : '0px')};
`;

interface ColorProps {
    color: string;
    selected?: boolean;
}
export const ColorButton = styled(SimpleButton)`
    color: ${({ selected }) => (selected ? textColor : chartLinkColor)};
    border: ${({ selected, color }: ColorProps) =>
        selected ? `1px solid ${color}` : ''};

    &:hover {
        border: 1px solid ${({ color }: ColorProps) => color};
        color: ${textColor};
    }
`;

export const OverflowText = styled.div`
    margin-left: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;
`;

export const ResponsiveLine = styled(SingleLine)`
    width: 100%;
    ${({ withWrap }: { withWrap?: boolean }) =>
        withWrap &&
        css`
            flex-wrap: wrap;
        `}

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

export const ResponsiveCol = styled.div`
    flex-grow: 1;

    @media (max-width: 578px) {
        width: 100%;
    }
`;

export const ResponsiveSingle = styled(SingleLine)`
    flex-grow: 1;
    min-width: 200px;

    @media (max-width: 578px) {
        width: 100%;
    }
`;
