import React, { useState } from 'react';
import { headerColor, headerTextColor } from '../../styles/Themes';
import { SingleLine } from '../../components/generic/Styled';
import { Cpu, MenuIcon, XSvg, Circle } from '../../components/generic/Icons';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { useTransition, animated } from 'react-spring';
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
} from './Header.styled';

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { syncedToChain, connected } = useStatusState();

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
              <animated.div key={key} style={props}>
                <XSvg size={'24px'} />
              </animated.div>
            ) : (
              <animated.div key={key} style={props}>
                <MenuIcon size={'24px'} />
              </animated.div>
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

  return (
    <>
      <Section withColor={true} color={headerColor} textColor={headerTextColor}>
        <HeaderStyle>
          <HeaderLine loggedIn={connected}>
            <Link to={connected ? '/home' : '/'} underline={'transparent'}>
              <HeaderTitle withPadding={!connected}>
                <IconPadding>
                  <Cpu color={'white'} />
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
