import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { headerColor, headerTextColor } from '../../styles/Themes';
import { HomeButton } from '../../views/entry/homepage/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    Wrapper,
} from '../../components/generic/Styled';
import { Cpu, MenuIcon, XSvg } from '../../components/generic/Icons';
import { BurgerMenu } from 'components/burgerMenu/BurgerMenu';
import { useSize } from 'hooks/UseSize';
import { useTransition, animated } from 'react-spring';

const HeaderStyle = styled.div`
    padding: 16px 0;
    ${({ open, withPadding }: { open: boolean; withPadding?: boolean }) =>
        !open &&
        withPadding &&
        css`
            margin-bottom: 16px;
        `}
`;

const HeaderTitle = styled.div`
    color: ${headerTextColor};
    font-weight: 900;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
`;

const AnimatedBurger = animated(MenuIcon);
const AnimatedClose = animated(XSvg);

export const Header = () => {
    const { width } = useSize();
    const { loggedIn, name } = useAccount();
    const [open, setOpen] = useState(false);

    const transitions = useTransition(open, null, {
        from: { position: 'absolute', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    const renderLoggedIn = () => {
        if (width <= 578) {
            return (
                <IconWrapper onClick={() => setOpen(prev => !prev)}>
                    {transitions.map(({ item, key, props }) =>
                        item ? (
                            <AnimatedClose style={props} size={'24px'} />
                        ) : (
                            <AnimatedBurger style={props} size={'24px'} />
                        ),
                    )}
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
            <Wrapper
                withColor={true}
                color={headerColor}
                textColor={headerTextColor}
            >
                <HeaderStyle open={open} withPadding={loggedIn}>
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
