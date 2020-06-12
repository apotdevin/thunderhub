import React, { useState } from 'react';
import {
  Cpu,
  Menu,
  X,
  CreditCard,
  MessageCircle,
  Settings,
  Home,
  Icon,
} from 'react-feather';
import { useTransition, animated } from 'react-spring';
import { useRouter } from 'next/router';
import { clientEnv } from 'server/utils/appEnv';
import { headerColor, headerTextColor } from '../../styles/Themes';
import { SingleLine } from '../../components/generic/Styled';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { Section } from '../../components/section/Section';
import { useStatusState } from '../../context/StatusContext';
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

const HOME = '/home';
const TRADER = '/trading';
const CHAT = '/chat';
const SETTINGS = '/settings';

const { hodlhodl } = clientEnv;

export const Header = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const { connected } = useStatusState();

  const showHomeButton = (): boolean =>
    pathname === TRADER || pathname === CHAT || pathname === SETTINGS;

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
          {hodlhodl && renderNavButton(TRADER, CreditCard)}
          {renderNavButton(CHAT, MessageCircle)}
          {renderNavButton(SETTINGS, Settings)}
        </HeaderButtons>
      </ViewSwitch>
    </>
  );

  return (
    <>
      <Section withColor={true} color={headerColor} textColor={headerTextColor}>
        <HeaderStyle>
          <HeaderLine loggedIn={connected}>
            <Link to={connected ? '/home' : '/'} underline={'transparent'}>
              <HeaderTitle withPadding={!connected}>
                <IconPadding>
                  <Cpu color={'white'} size={18} />
                </IconPadding>
                ThunderHub
              </HeaderTitle>
            </Link>
            <SingleLine>{connected && renderLoggedIn()}</SingleLine>
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
