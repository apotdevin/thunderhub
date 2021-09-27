import React, { FC, SVGAttributes } from 'react';
import styled, { css } from 'styled-components';
import {
  Home,
  Cpu,
  Server,
  Settings,
  Shield,
  Crosshair,
  GitPullRequest,
  Link as LinkIcon,
  Repeat,
  Users,
  MessageCircle,
  BarChart2,
  Heart,
  Shuffle,
  Aperture,
  Grid,
} from 'react-feather';
import { useRouter } from 'next/router';
import { useBaseConnect } from 'src/hooks/UseBaseConnect';
import {
  unSelectedNavButton,
  navBackgroundColor,
  navTextColor,
  subCardColor,
  mediaWidths,
  burgerRowColor,
} from '../../styles/Themes';
import { useConfigState } from '../../context/ConfigContext';
import { Link } from '../../components/link/Link';
import { SideSettings } from './sideSettings/SideSettings';
import { NodeInfo } from './nodeInfo/NodeInfo';

// Icon import from react-feather is not working
// TODO: recheck if the type is available
type IconProps = SVGAttributes<SVGElement> & {
  color?: string;
  size?: string | number;
};
type Icon = FC<IconProps>;

const NavigationStyle = styled.div<{ isOpen: boolean }>`
  grid-area: nav;
  width: ${({ isOpen }) => (isOpen ? '200px' : '60px')};

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

const ButtonSection = styled.div<{ isOpen: boolean }>`
  width: 100%;
  ${({ isOpen }) =>
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

const NavButton = styled.div<NavProps>`
  padding: 4px;
  border-radius: 4px;
  background: ${({ selected }) => selected && navBackgroundColor};
  display: flex;
  align-items: center;
  ${({ isOpen }) => !isOpen && 'justify-content: center'};
  width: 100%;
  text-decoration: none;
  margin: 4px 0;
  color: ${({ selected }) => (selected ? navTextColor : unSelectedNavButton)};

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
  background: ${burgerRowColor};
  margin: 0 -16px;
  padding: 16px;
`;

const BurgerNav = styled.a<NavProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 8px;
  border-radius: 4px;
  text-decoration: none;
  background: ${({ selected }) => selected && subCardColor};
  ${({ isOpen }) => !isOpen && 'justify-content: center'};
  color: ${({ selected }) => (selected ? navTextColor : unSelectedNavButton)};
`;

const HOME = '/';
const DASHBOARD = '/dashboard';
const PEERS = '/peers';
const CHANNEL = '/channels';
const REBALANCE = '/rebalance';
const TRANS = '/transactions';
const FORWARDS = '/forwards';
const CHAIN_TRANS = '/chain';
const TOOLS = '/tools';
const DETAILS = '/details';
const STATS = '/stats';
const DONATIONS = '/leaderboard';
const CHAT = '/chat';
const SETTINGS = '/settings';
const SWAP = '/swap';
const SCORES = '/scores';

interface NavigationProps {
  isBurger?: boolean;
  setOpen?: (state: boolean) => void;
}

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
  const { pathname } = useRouter();
  const { sidebar } = useConfigState();

  const { connected } = useBaseConnect();

  const isRoot = pathname === '/login' || pathname === '/sso';

  const renderNavButton = (
    title: string,
    link: string,
    NavIcon: Icon,
    open = true
  ) => (
    <Link to={link}>
      <NavButton isOpen={sidebar} selected={pathname === link}>
        <NavIcon size={18} />
        {open && <NavSeparation>{title}</NavSeparation>}
      </NavButton>
    </Link>
  );

  const renderBurgerNav = (title: string, link: string, NavIcon: Icon) => (
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
      {renderNavButton('Dashboard', DASHBOARD, Grid, sidebar)}
      {renderNavButton('Peers', PEERS, Users, sidebar)}
      {renderNavButton('Channels', CHANNEL, Cpu, sidebar)}
      {renderNavButton('Rebalance', REBALANCE, Repeat, sidebar)}
      {renderNavButton('Details', DETAILS, Crosshair, sidebar)}
      {renderNavButton('Transactions', TRANS, Server, sidebar)}
      {renderNavButton('Forwards', FORWARDS, GitPullRequest, sidebar)}
      {renderNavButton('Chain', CHAIN_TRANS, LinkIcon, sidebar)}
      {renderNavButton('Tools', TOOLS, Shield, sidebar)}
      {renderNavButton('Swap', SWAP, Shuffle, sidebar)}
      {renderNavButton('Stats', STATS, BarChart2, sidebar)}
      {renderNavButton('Scores', SCORES, Aperture, sidebar)}
    </ButtonSection>
  );

  const renderBurger = () => (
    <BurgerRow>
      {renderBurgerNav('Home', HOME, Home)}
      {renderBurgerNav('Dashboard', DASHBOARD, Grid)}
      {renderBurgerNav('Peers', PEERS, Users)}
      {renderBurgerNav('Channels', CHANNEL, Cpu)}
      {renderBurgerNav('Rebalance', REBALANCE, Repeat)}
      {renderBurgerNav('Details', DETAILS, Crosshair)}
      {renderBurgerNav('Transactions', TRANS, Server)}
      {renderBurgerNav('Forwards', FORWARDS, GitPullRequest)}
      {renderBurgerNav('Chain', CHAIN_TRANS, LinkIcon)}
      {renderBurgerNav('Tools', TOOLS, Shield)}
      {renderBurgerNav('Swap', SWAP, Shuffle)}
      {renderBurgerNav('Stats', STATS, BarChart2)}
      {renderBurgerNav('Scores', SCORES, Aperture)}
      {connected && renderBurgerNav('Donations', DONATIONS, Heart)}
      {renderBurgerNav('Chat', CHAT, MessageCircle)}
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
          {!isRoot && <NodeInfo isOpen={sidebar} />}
          {renderLinks()}
          <SideSettings />
        </LinkView>
      </StickyCard>
    </NavigationStyle>
  );
};
