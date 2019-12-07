import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { NodeInfo } from '../../components/nodeInfo/NodeInfo';
import { SideSettings } from '../../components/sideSettings/SideSettings';
import {
    textColor,
    unSelectedNavButton,
    navButtonColor,
} from '../../styles/Themes';
import {
    Home,
    Cpu,
    Server,
    Send,
    Settings,
} from '../../components/generic/Icons';
import { SettingsContext } from '../../context/SettingsContext';

const NavigationStyle = styled.div`
    grid-area: nav;
    margin-left: 0.5rem;
`;

const StickyCard = styled.div`
    position: -webkit-sticky;
    position: sticky;
    top: 10px;
`;

const LinkView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0;
`;

const ButtonSection = styled.div`
    width: 100%;
`;

const NavSeparation = styled.div`
    width: 10px;
`;

interface NavProps {
    selected: boolean;
    selectedColor?: string;
}

const NavButton = styled(({ selectedColor, ...rest }) => <Link {...rest} />)`
    padding: 10px;
    border-left: ${({ selected, selectedColor }: NavProps) =>
        selected ? `3px solid ${selectedColor ? selectedColor : 'white'}` : ''};
    background: ${({ selected }: NavProps) =>
        selected
            ? `linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.1) 0%,
		rgba(255, 255, 255, 0) 90%
	)`
            : ''};
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
    margin: 15px 0;
    color: ${({ selected }: NavProps) =>
        selected ? textColor : unSelectedNavButton};

    &:hover {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 90%
        );
        border-left: ${({ selectedColor }: NavProps) =>
            `3px solid ${selectedColor ? selectedColor : 'white'}`};
    }
`;

const HOME_LINK = '/';
const CHANNEL_LINK = '/channels';
const INVOICE_LINK = '/invoices';
const PAYMENT_LINK = '/payments';
const SETTINGS_LINK = '/settings';

export const Navigation = () => {
    const { theme } = useContext(SettingsContext);
    const { pathname } = useLocation();

    return (
        <NavigationStyle>
            <StickyCard>
                <LinkView>
                    <NodeInfo />
                    <ButtonSection>
                        <NavButton
                            selectedColor={navButtonColor[theme]}
                            selected={pathname === HOME_LINK}
                            to={HOME_LINK}
                        >
                            <Home />
                            <NavSeparation />
                            Home
                        </NavButton>
                        <NavButton
                            selectedColor={navButtonColor[theme]}
                            selected={pathname === CHANNEL_LINK}
                            to={CHANNEL_LINK}
                        >
                            <Cpu />
                            <NavSeparation />
                            Channels
                        </NavButton>
                        <NavButton
                            selectedColor={navButtonColor[theme]}
                            selected={pathname === INVOICE_LINK}
                            to={INVOICE_LINK}
                        >
                            <Server />
                            <NavSeparation />
                            Invoices
                        </NavButton>
                        <NavButton
                            selectedColor={navButtonColor[theme]}
                            selected={pathname === PAYMENT_LINK}
                            to={PAYMENT_LINK}
                        >
                            <Send />
                            <NavSeparation />
                            Payments
                        </NavButton>
                        <NavButton
                            selectedColor={navButtonColor[theme]}
                            selected={pathname === SETTINGS_LINK}
                            to={SETTINGS_LINK}
                        >
                            <Settings />
                            <NavSeparation />
                            Settings
                        </NavButton>
                    </ButtonSection>
                    <SideSettings />
                </LinkView>
            </StickyCard>
        </NavigationStyle>
    );
};
