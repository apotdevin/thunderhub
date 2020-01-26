import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { textColor } from '../../styles/Themes';
import { HomeButton } from '../../views/entry/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    Wrapper,
} from '../../components/generic/Styled';
import { Cpu, MenuIcon } from '../../components/generic/Icons';
import { BurgerMenu } from 'components/burgerMenu/BurgerMenu';
import { useSize } from 'hooks/UseSize';

const HeaderStyle = styled.div`
    padding: 16px 0;
    ${({ open }: { open: boolean }) =>
        !open &&
        css`
            margin-bottom: 16px;
        `}
`;

const HeaderTitle = styled.div`
    color: ${textColor};
    font-weight: 900;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Header = () => {
    const { width } = useSize();
    const { loggedIn, name } = useAccount();
    const [open, setOpen] = useState(false);

    const renderLoggedIn = () => {
        if (width <= 578) {
            return (
                <IconWrapper onClick={() => setOpen(prev => !prev)}>
                    <MenuIcon size={'24px'}>Menu</MenuIcon>
                </IconWrapper>
            );
        } else {
            return <Sub4Title>{`Account: ${name}`}</Sub4Title>;
        }
    };

    const renderLoggedOut = () => (
        <Link to="/login" style={{ textDecoration: 'none' }}>
            <HomeButton>Login</HomeButton>
        </Link>
    );

    return (
        <>
            <Wrapper withColor={true}>
                <HeaderStyle open={open}>
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
            {open && width <= 578 && (
                <BurgerMenu open={open} setOpen={setOpen} />
            )}
        </>
    );
};
