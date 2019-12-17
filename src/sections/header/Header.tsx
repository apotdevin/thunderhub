import React from 'react';
import styled from 'styled-components';
import { textColor, cardColor } from '../../styles/Themes';

const HeaderStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    background-color: ${cardColor};
    grid-area: header;
    margin-bottom: 10px;
`;

const Wrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto 0 auto;
    padding: 0 0.5rem;
    width: 100%;
    height: 100%;
`;

const HeaderTitle = styled.div`
    color: ${textColor};
    font-weight: bolder;
`;

export const Header = () => {
    return (
        <HeaderStyle>
            <Wrapper>
                <HeaderTitle>ThunderHub</HeaderTitle>
            </Wrapper>
        </HeaderStyle>
    );
};
