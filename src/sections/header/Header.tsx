import React from 'react';
import styled from 'styled-components';
import { textColor } from '../../styles/Themes';
import { HomeButton } from '../../views/entry/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    Wrapper,
} from '../../components/generic/Styled';
import { Cpu } from '../../components/generic/Icons';

const HeaderStyle = styled.div`
    padding: 16px 0;
    margin-bottom: 10px;
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
        <Wrapper withColor={true}>
            <HeaderStyle>
                <SingleLine>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <SingleLine>
                            <Cpu />
                            <HeaderTitle>ThunderHub</HeaderTitle>
                        </SingleLine>
                    </Link>
                    <SingleLine>
                        {loggedIn ? renderLoggedIn() : renderLoggedOut()}
                    </SingleLine>
                </SingleLine>
            </HeaderStyle>
        </Wrapper>
    );
};
