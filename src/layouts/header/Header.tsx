import React, { useState } from 'react';
import {
  Cpu,
  Menu,
  X,
  MessageCircle,
  Settings,
  Home,
  Icon,
  Heart,
  Activity,
} from 'react-feather';
import { useTransition, animated } from 'react-spring';
import { useRouter } from 'next/router';
import { useBaseConnect } from 'src/hooks/UseBaseConnect';
import { LogoutButton } from 'src/components/logoutButton';
import { useConfigState } from 'src/context/ConfigContext';
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

const MAIN = '/';
const HOME = '/home';
const CHAT = '/chat';
const DONATIONS = '/leaderboard';
const SETTINGS = '/settings';
const LN_MARKETS = '/lnmarkets';

export const Header = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const { lnMarketsAuth } = useConfigState();
  const connected = useBaseConnect();

  const isRoot = pathname === '/';

  const showHomeButton = (): boolean => pathname !== MAIN && pathname !== HOME;

  const transitions = useTransition(open, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

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
          {transitions.map(({ item, key, props }) =>
            item ? (
              <animated.div key={key} style={props}>
                <X size={24} />
              </animated.div>
            ) : (
              <animated.div key={key} style={props}>
                <Menu size={24} />
              </animated.div>
            )
          )}
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
            <Link to={!isRoot ? '/home' : '/'} underline={'transparent'}>
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
