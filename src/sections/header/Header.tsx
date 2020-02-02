import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
    headerColor,
    headerTextColor,
    themeColors,
    mediaWidths,
} from '../../styles/Themes';
import { HomeButton } from '../../views/entry/homepage/HomePage.styled';
import { Link } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    ResponsiveLine,
} from '../../components/generic/Styled';
import { Cpu, MenuIcon, XSvg, Zap } from '../../components/generic/Icons';
import { BurgerMenu } from 'components/burgerMenu/BurgerMenu';
import { useSize } from 'hooks/UseSize';
import { useTransition, animated } from 'react-spring';
import { Section } from 'components/section/Section';

const HeaderStyle = styled.div`
    padding: 16px 0;
`;

const IconPadding = styled.div`
    padding-right: 6px;
    margin-bottom: -4px;
`;

const HeaderTitle = styled.div`
    color: ${headerTextColor};
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ withPadding }: { withPadding: boolean }) =>
        withPadding &&
        css`
            @media (${mediaWidths.mobile}) {
                margin-bottom: 16px;
            }
        `}
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
`;

const LinkWrapper = styled.div`
    color: ${headerTextColor};
    margin: ${({ last }: { last?: boolean }) =>
        last ? '0 16px 0 4px' : '0 4px'};

    :hover {
        color: ${themeColors.blue2};
    }
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
        <>
            <Link to="/faq" style={{ textDecoration: 'none' }}>
                <LinkWrapper>Faq</LinkWrapper>
            </Link>
            <Link to="/terms" style={{ textDecoration: 'none' }}>
                <LinkWrapper>Terms</LinkWrapper>
            </Link>
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
                <LinkWrapper last={true}>Privacy</LinkWrapper>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <HomeButton>
                    <Zap fillcolor={'white'} color={'white'} />
                </HomeButton>
            </Link>
        </>
    );

    const HeaderWrapper =
        width <= 578 && !loggedIn ? ResponsiveLine : SingleLine;

    return (
        <>
            <Section
                withColor={true}
                color={headerColor}
                textColor={headerTextColor}
            >
                <HeaderStyle>
                    <HeaderWrapper>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <HeaderTitle
                                withPadding={width <= 578 && !loggedIn}
                            >
                                <IconPadding>
                                    <Cpu color={'white'} />
                                </IconPadding>
                                ThunderHub
                            </HeaderTitle>
                        </Link>
                        <SingleLine>
                            {loggedIn ? renderLoggedIn() : renderLoggedOut()}
                        </SingleLine>
                    </HeaderWrapper>
                </HeaderStyle>
            </Section>
            {open && width <= 578 && (
                <BurgerMenu open={open} setOpen={setOpen} />
            )}
        </>
    );
};
