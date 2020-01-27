import styled from 'styled-components';
import { ReactComponent as HeadlineImage } from '../../../assets/images/MoshingDoodle.svg';

export const Headline = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0 120px;

    @media (max-width: 578px) {
        flex-direction: column-reverse;
    }
`;

export const LeftHeadline = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;

    @media (max-width: 578px) {
        width: 100%;
        text-align: center;
    }
`;

export const StyledImage = styled(HeadlineImage)`
    width: 500px;

    @media (max-width: 578px) {
        width: unset;
    }
`;

export const HomeButton = styled.button`
    cursor: pointer;
    outline: none;
    padding: 8px 24px;
    text-decoration: 2px solid blue;
    font-size: 16px;
    background-image: linear-gradient(to right, #fd5f00, #ffa940);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    white-space: nowrap;
    min-width: 100px;
`;
