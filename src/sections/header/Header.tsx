import React from 'react';
import styled from 'styled-components';
import { textColor, cardColor } from '../../styles/Themes';
import { HomeButton } from '../../views/entry/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import { SingleLine, Sub4Title } from '../../components/generic/Styled';
import { Cpu } from '../../components/generic/Icons';

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
    font-weight: 900;
`;

export const Header = () => {
    const { loggedIn, name } = useAccount();

    const renderLoggedIn = () => <Sub4Title>{`Account: ${name}`}</Sub4Title>;

    const renderLoggedOut = () => (
        <Link to="/login" style={{ textDecoration: 'none' }}>
            <HomeButton>Login</HomeButton>
        </Link>
    );

    return (
        <HeaderStyle>
            <Wrapper>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <SingleLine>
                        <Cpu />
                        <HeaderTitle>ThunderHub</HeaderTitle>
                    </SingleLine>
                </Link>
                <SingleLine>
                    {loggedIn ? renderLoggedIn() : renderLoggedOut()}
                </SingleLine>
            </Wrapper>
        </HeaderStyle>
    );
};
