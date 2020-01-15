import React from 'react';
import styled from 'styled-components';
import { textColor, cardColor } from '../../styles/Themes';
import { HomeButton } from '../../views/entry/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';

const HeaderStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    background-color: ${cardColor};
    grid-area: header;
    margin-bottom: 10px;
`;

const Wrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto 0 auto;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const HeaderTitle = styled.div`
    color: ${textColor};
    font-weight: bolder;
`;

export const Header = () => {
    const { loggedIn } = useAccount();

    return (
        <HeaderStyle>
            <Wrapper>
                <HeaderTitle>ThunderHub</HeaderTitle>
                {!loggedIn && (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <HomeButton>Login</HomeButton>
                    </Link>
                )}
            </Wrapper>
        </HeaderStyle>
    );
};
