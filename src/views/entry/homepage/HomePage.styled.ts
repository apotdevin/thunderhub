import styled from 'styled-components';
import { ReactComponent as HeadlineImage } from '../../../assets/images/MoshingDoodle.svg';
import { fontColors, mediaWidths } from 'styles/Themes';

export const Headline = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 0 140px;

    @media (${mediaWidths.mobile}) {
        flex-direction: column-reverse;
    }
`;

export const LeftHeadline = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;

    @media (${mediaWidths.mobile}) {
        width: 100%;
        text-align: center;
    }
`;

export const StyledImage = styled(HeadlineImage)`
    width: 500px;

    @media (${mediaWidths.mobile}) {
        width: unset;
    }
`;

export const HomeButton = styled.button`
    cursor: pointer;
    outline: none;
    padding: 8px 24px;
    text-decoration: 2px solid blue;
    font-size: 16px;
    background-image: linear-gradient(to right, #fd5f00, #f99325);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    white-space: nowrap;
    width: 100%;
`;

export const Title = styled.h1`
    width: 100%;
    text-align: center;
    color: ${({ textColor }: { textColor?: string }) =>
        textColor ? textColor : fontColors.white};
    font-size: 32px;
    margin-bottom: 0;
`;

export const Text = styled.p`
    color: ${fontColors.white};
    text-align: justify;
    max-width: 400px;
`;
