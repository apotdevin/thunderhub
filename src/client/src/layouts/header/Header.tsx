import React, { FC, SVGAttributes, useEffect, useState } from 'react';
import {
  Cpu,
  Menu,
  X,
  MessageCircle,
  Settings,
  Home,
  Heart,
  Activity,
} from 'react-feather';
import { useRouter } from 'next/router';
import { useBaseConnect } from '../../hooks/UseBaseConnect';
import { LogoutButton } from '../../components/logoutButton';
import { useConfigState } from '../../context/ConfigContext';
import { headerColor, headerTextColor } from '../../styles/Themes';
import { SingleLine } from '../../components/generic/Styled';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { Section } from '../../components/section/Section';
import { Link } from '../../components/link/Link';
import { ViewSwitch } from '../../components/viewSwitch/ViewSwitch';
import {
  IconWrapper,
  HeaderStyle,
  HeaderLine,
  HeaderTitle,
  IconPadding,
  HeaderButtons,
  HeaderNavButton,
} from './Header.styled';

type IconProps = SVGAttributes<SVGElement> & {
  color?: string;
  size?: string | number;
};

export type Icon = FC<IconProps>;

const SSO = '/sso';
const MAIN = '/login';
const HOME = '/';
const CHAT = '/chat';
const DONATIONS = '/leaderboard';
const SETTINGS = '/settings';
const LN_MARKETS = '/lnmarkets';

export const Header = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const { lnMarketsAuth } = useConfigState();
  const { connected } = useBaseConnect();

  const isRoot = pathname === MAIN || pathname === SSO;

  const showHomeButton = (): boolean => !isRoot && pathname !== HOME;

  useEffect(() => {
    if (!isRoot || !open) return;
    setOpen(false);
  }, [isRoot, open]);

  const renderNavButton = (link: string, NavIcon: Icon) => (
    <Link to={link} noStyling={true}>
      <HeaderNavButton selected={pathname === link}>
        <NavIcon size={18} />
      </HeaderNavButton>
    </Link>
  );

  const renderLoggedIn = () => (
    <>
      <ViewSwitch>
        <IconWrapper onClick={() => setOpen(prev => !prev)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </IconWrapper>
      </ViewSwitch>
      <ViewSwitch hideMobile={true}>
        <HeaderButtons>
          {showHomeButton() && renderNavButton(HOME, Home)}
          {connected && renderNavButton(DONATIONS, Heart)}
          {lnMarketsAuth && renderNavButton(LN_MARKETS, Activity)}
          {renderNavButton(CHAT, MessageCircle)}
          {renderNavButton(SETTINGS, Settings)}
          <LogoutButton />
        </HeaderButtons>
      </ViewSwitch>
    </>
  );

  return (
    <>
      <Section
        color={pathname === MAIN ? 'transparent' : headerColor}
        textColor={headerTextColor}
      >
        <HeaderStyle>
          <HeaderLine loggedIn={!isRoot}>
            <Link to={!isRoot ? '/' : '/login'} underline={'transparent'}>
              <HeaderTitle withPadding={isRoot}>
                <IconPadding>
                  <Cpu color={'white'} size={18} />
                </IconPadding>
                ThunderHub
              </HeaderTitle>
            </Link>
            <SingleLine>{!isRoot && renderLoggedIn()}</SingleLine>
          </HeaderLine>
        </HeaderStyle>
      </Section>
      {open && (
        <ViewSwitch>
          <BurgerMenu open={open} setOpen={setOpen} />
        </ViewSwitch>
      )}
    </>
  );
};
