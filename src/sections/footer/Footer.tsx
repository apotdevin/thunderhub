import React from 'react';
import styled from 'styled-components';
import { cardColor } from '../../styles/Themes';

const FooterStyle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    background-color: ${cardColor};
    grid-area: footer;
    height: 300px;
`;

const Wrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto 0 auto;
    padding: 0 0.5rem;
    width: 100%;
    height: 100%;
`;

export const Footer = () => {
    return (
        <FooterStyle>
            <Wrapper>ThunderHub</Wrapper>
        </FooterStyle>
    );
};
