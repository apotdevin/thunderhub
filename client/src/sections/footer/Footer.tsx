import React from 'react';
import styled from 'styled-components';
import {
    headerColor,
    headerTextColor,
    fontColors,
    mediaWidths,
} from 'styles/Themes';
import { Section } from 'components/section/Section';
import { Link } from 'components/link/Link';
import { Emoji } from 'components/emoji/Emoji';
import { useAccount } from 'context/AccountContext';
import { Link as RouterLink } from 'react-router-dom';
import { HomeButton } from 'views/entry/homepage/HomePage.styled';
import { Zap } from 'components/generic/Icons';

const FooterStyle = styled.div`
    padding: 40px 0;
    min-height: 300px;
    color: ${headerTextColor};
    display: flex;
    justify-content: space-between;

    @media (${mediaWidths.mobile}) {
        flex-direction: column;
        padding: 0 0 40px;
        justify-content: center;
        align-items: center;
    }
`;

const SideFooter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    @media (${mediaWidths.mobile}) {
        width: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
`;

const RightFooter = styled(SideFooter)`
    justify-content: flex-start;
    align-items: flex-end;
    width: 80%;

    @media (${mediaWidths.mobile}) {
        margin-top: 32px;
    }
`;

const Title = styled.div`
    font-weight: 900;
    color: ${headerTextColor};
`;

const SideText = styled.p`
    font-size: 14px;
    color: ${fontColors.grey7};

    @media (${mediaWidths.mobile}) {
        padding-right: 0;
    }
`;

const CopyrightText = styled(SideText)`
    font-size: 12px;
    color: ${fontColors.blue};
`;

const StyledRouter = styled(RouterLink)`
    margin-top: 12px;

    ${HomeButton} {
        font-size: 14px;
    }
`;

const Line = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
`;

const Version = styled.div`
    font-size: 12px;
    margin-left: 8px;
`;

const APP_VERSION = process.env.REACT_APP_VERSION || '0.0.0';

export const Footer = () => {
    const { loggedIn } = useAccount();
    return (
        <Section withColor={true} color={headerColor}>
            <FooterStyle>
                <SideFooter>
                    <Line>
                        <RouterLink to="/" style={{ textDecoration: 'none' }}>
                            <Title>ThunderHub</Title>
                        </RouterLink>
                        <Version>{`v${APP_VERSION}`}</Version>
                    </Line>
                    <SideText>
                        Open-source lightning node manager to control and
                        monitor your LND node.
                    </SideText>
                    <SideText>
                        Made in Munich with{' '}
                        <Emoji symbol={'🧡'} label={'heart'} /> and{' '}
                        <Emoji symbol={'⚡'} label={'lightning'} />.
                    </SideText>
                    <CopyrightText>
                        Copyright © 2020. All rights reserved. ThunderHub
                    </CopyrightText>
                </SideFooter>
                <RightFooter>
                    <Link to={'/faq'} color={fontColors.blue}>
                        FAQ
                    </Link>
                    <Link
                        href={'https://github.com/apotdevin/thunderhub'}
                        color={fontColors.blue}
                    >
                        Github
                    </Link>
                    <Link
                        href={'https://twitter.com/thunderhubio'}
                        color={fontColors.blue}
                    >
                        Twitter
                    </Link>
                    <Link to={'/terms'} color={fontColors.blue}>
                        Terms of Use
                    </Link>
                    <Link to={'/privacy'} color={fontColors.blue}>
                        Privacy Policy
                    </Link>
                    {!loggedIn && (
                        <StyledRouter
                            to="/login"
                            style={{ textDecoration: 'none' }}
                        >
                            <HomeButton>
                                <Zap fillcolor={'white'} color={'white'} />
                                LOGIN
                            </HomeButton>
                        </StyledRouter>
                    )}
                </RightFooter>
            </FooterStyle>
        </Section>
    );
};
