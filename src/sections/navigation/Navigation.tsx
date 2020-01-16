import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { NodeInfo } from './nodeInfo/NodeInfo';
import { SideSettings } from './sideSettings/SideSettings';
import {
    textColor,
    unSelectedNavButton,
    navButtonColor,
} from '../../styles/Themes';
import {
    Home,
    Cpu,
    Server,
    Settings,
    Shield,
    Crosshair,
    GitPullRequest,
    LinkIcon,
} from '../../components/generic/Icons';
import { useSettings } from '../../context/SettingsContext';

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
        selected
            ? `3px solid ${selectedColor ? selectedColor : textColor}`
            : ''};
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
            `3px solid ${selectedColor ? selectedColor : textColor}`};
    }
`;

const HOME = '/';
const CHANNEL = '/channels';
const TRANS = '/transactions';
const FORWARDS = '/forwards';
const CHAIN_TRANS = '/chainTransactions';
const BACKUPS = '/backups';
const SETTINGS = '/settings';
const FEES = '/fees';

export const Navigation = () => {
    const { theme } = useSettings();
    const { pathname } = useLocation();

    const renderNavButton = (title: string, link: string, NavIcon: any) => (
        <NavButton
            selectedColor={navButtonColor[theme]}
            selected={pathname === link}
            to={link}
        >
            <NavIcon />
            <NavSeparation />
            {title}
        </NavButton>
    );

    return (
        <NavigationStyle>
            <StickyCard>
                <LinkView>
                    <NodeInfo />
                    <ButtonSection>
                        {renderNavButton('Home', HOME, Home)}
                        {renderNavButton('Channels', CHANNEL, Cpu)}
                        {renderNavButton('Fees', FEES, Crosshair)}
                        {renderNavButton('Transactions', TRANS, Server)}
                        {renderNavButton('Forwards', FORWARDS, GitPullRequest)}
                        {renderNavButton('Chain', CHAIN_TRANS, LinkIcon)}
                        {renderNavButton('Backups', BACKUPS, Shield)}
                        {renderNavButton('Settings', SETTINGS, Settings)}
                    </ButtonSection>
                    <SideSettings />
                </LinkView>
            </StickyCard>
        </NavigationStyle>
    );
};
