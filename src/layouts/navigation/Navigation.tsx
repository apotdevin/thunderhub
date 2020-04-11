import React from 'react';
import styled, { css } from 'styled-components';
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
  RepeatIcon,
  Users,
  CreditCard,
} from '../../components/generic/Icons';
import { useSettings } from '../../context/SettingsContext';
import { useConnectionState } from '../../context/ConnectionContext';
import { useRouter } from 'next/router';
import { Link } from '../../components/link/Link';

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
  font-size: 14px;
`;

interface NavProps {
  selected: boolean;
  isOpen?: boolean;
}

const NavButton = styled.div`
  padding: 4px;
  border-radius: 4px;
  background: ${({ selected }: NavProps) => selected && navBackgroundColor};
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
`;

const BurgerRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: scroll;
  background: ${cardBorderColor};
  margin: 0 -16px;
  padding: 16px;
`;

const BurgerNav = styled.a`
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
`;

const HOME = '/home';
const PEERS = '/peers';
const CHANNEL = '/channels';
const BALANCE = '/balance';
const TRANS = '/transactions';
const FORWARDS = '/forwards';
const CHAIN_TRANS = '/chain';
const TOOLS = '/tools';
const SETTINGS = '/settings';
const FEES = '/fees';
const TRADER = '/trading';

interface NavigationProps {
  isBurger?: boolean;
  setOpen?: (state: boolean) => void;
}

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
  const { pathname } = useRouter();
  const { sidebar, setSettings } = useSettings();
  const { connected } = useConnectionState();

  const renderNavButton = (
    title: string,
    link: string,
    NavIcon: any,
    open: boolean = true
  ) => (
    <Link to={link}>
      <NavButton isOpen={sidebar} selected={pathname === link}>
        <NavIcon />
        {open && <NavSeparation>{title}</NavSeparation>}
      </NavButton>
    </Link>
  );

  const renderBurgerNav = (title: string, link: string, NavIcon: any) => (
    <Link to={link}>
      <BurgerNav
        selected={pathname === link}
        onClick={() => setOpen && setOpen(false)}
      >
        <NavIcon />
        {title}
      </BurgerNav>
    </Link>
  );

  const renderLinks = () => (
    <ButtonSection isOpen={sidebar}>
      {renderNavButton('Home', HOME, Home, sidebar)}
      {renderNavButton('Peers', PEERS, Users, sidebar)}
      {renderNavButton('Channels', CHANNEL, Cpu, sidebar)}
      {renderNavButton('Balance', BALANCE, RepeatIcon, sidebar)}
      {renderNavButton('Fees', FEES, Crosshair, sidebar)}
      {renderNavButton('Transactions', TRANS, Server, sidebar)}
      {renderNavButton('Forwards', FORWARDS, GitPullRequest, sidebar)}
      {renderNavButton('Chain', CHAIN_TRANS, LinkIcon, sidebar)}
      {renderNavButton('Tools', TOOLS, Shield, sidebar)}
      {renderNavButton('P2P Trading', TRADER, CreditCard, sidebar)}
      {renderNavButton('Settings', SETTINGS, Settings, sidebar)}
    </ButtonSection>
  );

  const renderBurger = () => (
    <BurgerRow>
      {renderBurgerNav('Home', HOME, Home)}
      {renderBurgerNav('Peers', PEERS, Users)}
      {renderBurgerNav('Channels', CHANNEL, Cpu)}
      {renderBurgerNav('Balance', BALANCE, RepeatIcon)}
      {renderBurgerNav('Fees', FEES, Crosshair)}
      {renderBurgerNav('Transactions', TRANS, Server)}
      {renderBurgerNav('Forwards', FORWARDS, GitPullRequest)}
      {renderBurgerNav('Chain', CHAIN_TRANS, LinkIcon)}
      {renderBurgerNav('Tools', TOOLS, Shield)}
      {renderBurgerNav('Trading', TRADER, CreditCard)}
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
