import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { NodeInfo } from './nodeInfo/NodeInfo';
import { SideSettings } from './sideSettings/SideSettings';
import {
    unSelectedNavButton,
    navBackgroundColor,
    navTextColor,
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
    width: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? '200px' : '60px')};

    @media (max-width: 578px) {
        display: none;
    }
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
    ${({ isOpen }: { isOpen: boolean }) =>
        !isOpen &&
        css`
            margin: 8px 0;
        `}
`;

const NavSeparation = styled.div`
    margin-left: 8px;
`;

interface NavProps {
    selected: boolean;
    selectedColor?: string;
    isOpen?: boolean;
}

const NavButton = styled(({ selectedColor, ...rest }) => <Link {...rest} />)(
    () => css`
        padding: 8px;
        border-radius: 4px;
        background: ${({ selected }: NavProps) =>
            selected && navBackgroundColor};
        display: flex;
        align-items: center;
        ${({ isOpen }: NavProps) => !isOpen && 'justify-content: center'};
        width: 100%;
        text-decoration: none;
        margin: 4px 0;
        color: ${({ selected }: NavProps) =>
            selected ? navTextColor : unSelectedNavButton};

        &:hover {
            color: ${navTextColor};
            background: ${navBackgroundColor};
        }
    `,
);

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
    const { sidebar, setSettings } = useSettings();

    const renderNavButton = (
        title: string,
        link: string,
        NavIcon: any,
        open: boolean = true,
    ) => (
        <NavButton isOpen={sidebar} selected={pathname === link} to={link}>
            <NavIcon />
            {open && <NavSeparation>{title}</NavSeparation>}
        </NavButton>
    );

    return (
        <NavigationStyle isOpen={sidebar}>
            <StickyCard>
                <LinkView>
                    <NodeInfo isOpen={sidebar} />
                    <ButtonSection isOpen={sidebar}>
                        {renderNavButton('Home', HOME, Home, sidebar)}
                        {renderNavButton('Channels', CHANNEL, Cpu, sidebar)}
                        {renderNavButton('Fees', FEES, Crosshair, sidebar)}
                        {renderNavButton('Transactions', TRANS, Server, sidebar)}
                        {renderNavButton(
                            'Forwards',
                            FORWARDS,
                            GitPullRequest,
                            sidebar,
                        )}
                        {renderNavButton(
                            'Chain',
                            CHAIN_TRANS,
                            LinkIcon,
                            sidebar,
                        )}
                        {renderNavButton('Backups', BACKUPS, Shield, sidebar)}
                        {renderNavButton(
                            'Settings',
                            SETTINGS,
                            Settings,
                            sidebar,
                        )}
                    </ButtonSection>
                    <SideSettings isOpen={sidebar} setIsOpen={setSettings} />
                </LinkView>
            </StickyCard>
        </NavigationStyle>
    );
};
