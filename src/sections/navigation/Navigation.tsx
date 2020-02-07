import React from 'react';
import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { NodeInfo } from './nodeInfo/NodeInfo';
import { SideSettings } from './sideSettings/SideSettings';
import {
    unSelectedNavButton,
    navBackgroundColor,
    navTextColor,
    subCardColor,
    cardBorderColor,
    mediaWidths,
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
import { useConnectionState } from 'context/ConnectionContext';

const NavigationStyle = styled.div`
    grid-area: nav;
    width: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? '200px' : '60px')};

    @media (${mediaWidths.mobile}) {
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
        padding: 4px;
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

const BurgerRow = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: scroll;
    background: ${cardBorderColor};
    margin: 0 -16px;
    padding: 16px;
`;

const BurgerNav = styled(({ selectedColor, ...rest }) => <Link {...rest} />)(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 16px 8px;
        border-radius: 4px;
        text-decoration: none;
        background: ${({ selected }: NavProps) => selected && subCardColor};
        ${({ isOpen }: NavProps) => !isOpen && 'justify-content: center'};
        color: ${({ selected }: NavProps) =>
            selected ? navTextColor : unSelectedNavButton};
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

interface NavigationProps {
    isBurger?: boolean;
    setOpen?: (state: boolean) => void;
}

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
    const { pathname } = useLocation();
    const { sidebar, setSettings } = useSettings();
    const { connected } = useConnectionState();

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

    const renderBurgerNav = (title: string, link: string, NavIcon: any) => (
        <BurgerNav
            selected={pathname === link}
            to={link}
            onClick={() => setOpen && setOpen(false)}
        >
            <NavIcon />
            {title}
        </BurgerNav>
    );

    const renderLinks = () => (
        <ButtonSection isOpen={sidebar}>
            {renderNavButton('Home', HOME, Home, sidebar)}
            {renderNavButton('Channels', CHANNEL, Cpu, sidebar)}
            {renderNavButton('Fees', FEES, Crosshair, sidebar)}
            {renderNavButton('Transactions', TRANS, Server, sidebar)}
            {renderNavButton('Forwards', FORWARDS, GitPullRequest, sidebar)}
            {renderNavButton('Chain', CHAIN_TRANS, LinkIcon, sidebar)}
            {renderNavButton('Backups', BACKUPS, Shield, sidebar)}
            {renderNavButton('Settings', SETTINGS, Settings, sidebar)}
        </ButtonSection>
    );

    const renderBurger = () => (
        <BurgerRow>
            {renderBurgerNav('Home', HOME, Home)}
            {renderBurgerNav('Channels', CHANNEL, Cpu)}
            {renderBurgerNav('Fees', FEES, Crosshair)}
            {renderBurgerNav('Transactions', TRANS, Server)}
            {renderBurgerNav('Forwards', FORWARDS, GitPullRequest)}
            {renderBurgerNav('Chain', CHAIN_TRANS, LinkIcon)}
            {renderBurgerNav('Backups', BACKUPS, Shield)}
            {renderBurgerNav('Settings', SETTINGS, Settings)}
        </BurgerRow>
    );

    if (isBurger) {
        return renderBurger();
    }

    return (
        <NavigationStyle isOpen={sidebar}>
            <StickyCard>
                <LinkView>
                    {connected && <NodeInfo isOpen={sidebar} />}
                    {renderLinks()}
                    <SideSettings isOpen={sidebar} setIsOpen={setSettings} />
                </LinkView>
            </StickyCard>
        </NavigationStyle>
    );
};
