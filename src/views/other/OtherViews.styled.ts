import styled from 'styled-components';
import { Card, CardProps } from 'components/generic/Styled';
import { themeColors, fontColors, mediaWidths } from 'styles/Themes';

export const Center = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

export const Title = styled.h1`
    width: 100%;
    text-align: center;
    color: ${({ textColor }: { textColor?: string }) =>
        textColor ? textColor : fontColors.grey3};
    font-size: 40px;

    @media (${mediaWidths.mobile}) {
        font-size: 24px;
    }
`;

export const SectionTitle = styled.h2`
    color: ${({ textColor }: { textColor?: string }) =>
        textColor ? textColor : fontColors.blue};
    font-size: 24px;
`;

export const Subtitle = styled.h2`
    color: ${({ textColor }: { textColor?: string }) =>
        textColor ? textColor : fontColors.blue};
    font-size: 16px;
    max-width: 600px;
`;

export const Question = styled.h3`
    color: ${fontColors.grey8};
`;

export const Text = styled.p`
    color: ${fontColors.grey6};
    text-align: justify;
`;

export const SmallText = styled(Text)`
    text-align: start;
`;

export const BulletPoint = styled(Text)`
    margin-left: 32px;
`;

export const DetailCard = styled(Card)<CardProps>`
    background-color: ${themeColors.white};
    margin-bottom: 0;
    margin: 8px 16px;
    z-index: 1;
    flex: 1 0 30%;
    border: 1px solid ${themeColors.grey2};

    @media (${mediaWidths.mobile}) {
        flex: 1 0 100%;
    }
`;

export const DetailLine = styled.div`
    margin: 0 -16px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    @media (${mediaWidths.mobile}) {
        margin: 0;
    }
`;

export const IconTitle = styled.div`
    display: flex;
`;

export const IconMargin = styled.span`
    margin-right: 4px;
`;
