import styled from 'styled-components';
import { ReactComponent as HeadlineImage } from '../../images/MoshingDoodle.svg';

export const Headline = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0;
`;

export const LeftHeadline = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
`;

export const StyledImage = styled(HeadlineImage)`
    width: 500px;
`;

export const HomeButton = styled.button`
    cursor: pointer;
    outline: none;
    padding: 8px 24px;
    text-decoration: 2px solid blue;
    font-size: 16px;
    background-image: linear-gradient(to right, #fe4928, #ffc700);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    white-space: nowrap;
    min-width: 100px;
`;
