import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { NodeInfo } from './nodeInfo/NodeInfo';
import { SideSettings } from './sideSettings/SideSettings';
import {
    textColor,
    unSelectedNavButton,
    navBackgroundColor,
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

const NavigationStyle = styled.div`
    grid-area: nav;
`;

const StickyCard = styled.div`
    position: -webkit-sticky;
    position: sticky;
    top: 16px;
`;

const LinkView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0;
`;

const ButtonSection = styled.div`
    width: 100%;
`;

const NavSeparation = styled.div`
    margin-left: 8px;
`;

interface NavProps {
    selected: boolean;
    selectedColor?: string;
}

const NavButton = styled(({ selectedColor, ...rest }) => <Link {...rest} />)`
    padding: 8px;
    border-radius: 4px;
    background: ${({ selected }: NavProps) => selected && navBackgroundColor};
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
    margin: 8px 0;
    color: ${({ selected }: NavProps) =>
        selected ? textColor : unSelectedNavButton};

    &:hover {
        color: ${textColor};
        background: ${navBackgroundColor};
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
    const { pathname } = useLocation();

    const renderNavButton = (title: string, link: string, NavIcon: any) => (
        <NavButton selected={pathname === link} to={link}>
            <NavIcon />
            <NavSeparation>{title}</NavSeparation>
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
