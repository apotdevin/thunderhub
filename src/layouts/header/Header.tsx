import React, { useState } from 'react';
import { headerColor, headerTextColor } from '../../styles/Themes';
import { HomeButton } from '../../views/homepage/HomePage.styled';
import { useAccount } from '../../context/AccountContext';
import { SingleLine } from '../../components/generic/Styled';
import {
  Cpu,
  MenuIcon,
  XSvg,
  Zap,
  Circle,
} from '../../components/generic/Icons';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { useTransition, animated } from 'react-spring';
import { Section } from '../../components/section/Section';
import { useStatusState } from '../../context/StatusContext';
import { Link } from '../../components/link/Link';
import { ViewSwitch } from '../../components/viewSwitch/ViewSwitch';
import {
  IconWrapper,
  LinkWrapper,
  HeaderStyle,
  HeaderLine,
  HeaderTitle,
  IconPadding,
} from './Header.styled';

const AnimatedBurger = animated(MenuIcon);
const AnimatedClose = animated(XSvg);

export const Header = () => {
  const { loggedIn } = useAccount();
  const [open, setOpen] = useState(false);
  const { syncedToChain } = useStatusState();

  const transitions = useTransition(open, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const renderLoggedIn = () => (
    <>
      <ViewSwitch>
        <IconWrapper onClick={() => setOpen(prev => !prev)}>
          {transitions.map(({ item, key, props }) =>
            item ? (
              <AnimatedClose key={key} style={props} size={'24px'} />
            ) : (
              <AnimatedBurger key={key} style={props} size={'24px'} />
            )
          )}
        </IconWrapper>
      </ViewSwitch>
      <ViewSwitch hideMobile={true}>
        <Circle
          size={'12px'}
          strokeWidth={'0'}
          fillcolor={syncedToChain ? '#95de64' : '#ff7875'}
        />
      </ViewSwitch>
    </>
  );

  const renderLoggedOut = () => (
    <>
      <Link underline={'transaparent'} to="/faq">
        <LinkWrapper>Faq</LinkWrapper>
      </Link>
      <Link underline={'transaparent'} to="/terms">
        <LinkWrapper>Terms</LinkWrapper>
      </Link>
      <Link underline={'transaparent'} to="/privacy">
        <LinkWrapper last={true}>Privacy</LinkWrapper>
      </Link>
      <Link underline={'transaparent'} to="/login">
        <HomeButton>
          <Zap fillcolor={'white'} color={'white'} />
        </HomeButton>
      </Link>
    </>
  );

  return (
    <>
      <Section withColor={true} color={headerColor} textColor={headerTextColor}>
        <HeaderStyle>
          <HeaderLine loggedIn={loggedIn}>
            <Link to={loggedIn ? '/home' : '/'} underline={'transparent'}>
              <HeaderTitle withPadding={!loggedIn}>
                <IconPadding>
                  <Cpu color={'white'} />
                </IconPadding>
                ThunderHub
              </HeaderTitle>
            </Link>
            <SingleLine>
              {loggedIn ? renderLoggedIn() : renderLoggedOut()}
            </SingleLine>
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
