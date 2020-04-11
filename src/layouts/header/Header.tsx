import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  headerColor,
  headerTextColor,
  themeColors,
  mediaWidths,
  mediaDimensions,
} from '../../styles/Themes';
import { HomeButton } from '../../views/homepage/HomePage.styled';
import { useAccount } from '../../context/AccountContext';
import { SingleLine, ResponsiveLine } from '../../components/generic/Styled';
import {
  Cpu,
  MenuIcon,
  XSvg,
  Zap,
  Circle,
} from '../../components/generic/Icons';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { useSize } from '../../hooks/UseSize';
import { useTransition, animated } from 'react-spring';
import { Section } from '../../components/section/Section';
import { useStatusState } from '../../context/StatusContext';
import { Link } from '../../components/link/Link';

const HeaderStyle = styled.div`
  padding: 16px 0;
`;

const IconPadding = styled.div`
  padding-right: 6px;
  margin-bottom: -4px;
`;

const HeaderTitle = styled.div`
  color: ${headerTextColor};
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ withPadding }: { withPadding: boolean }) =>
    withPadding &&
    css`
      @media (${mediaWidths.mobile}) {
        margin-bottom: 16px;
      }
    `}
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;

const LinkWrapper = styled.div`
  color: ${headerTextColor};
  margin: ${({ last }: { last?: boolean }) =>
    last ? '0 16px 0 4px' : '0 4px'};

  :hover {
    color: ${themeColors.blue2};
  }
`;

const AnimatedBurger = animated(MenuIcon);
const AnimatedClose = animated(XSvg);

export const Header = () => {
  const { width } = useSize();
  const { loggedIn } = useAccount();
  const [open, setOpen] = useState(false);
  const { syncedToChain } = useStatusState();

  const transitions = useTransition(open, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const renderLoggedIn = () => {
    if (width <= mediaDimensions.mobile) {
      return (
        <IconWrapper onClick={() => setOpen(prev => !prev)}>
          {transitions.map(({ item, key, props }) =>
            item ? (
              <AnimatedClose key={key} style={props} size={'24px'} />
            ) : (
              <AnimatedBurger key={key} style={props} size={'24px'} />
            )
          )}
        </IconWrapper>
      );
    }
    return (
      <Circle
        size={'12px'}
        strokeWidth={'0'}
        fillcolor={syncedToChain ? '#95de64' : '#ff7875'}
      />
    );
  };

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

  const HeaderWrapper =
    width <= mediaDimensions.mobile && !loggedIn ? ResponsiveLine : SingleLine;

  return (
    <>
      <Section withColor={true} color={headerColor} textColor={headerTextColor}>
        <HeaderStyle>
          <HeaderWrapper>
            <Link to={loggedIn ? '/home' : '/'} underline={'transparent'}>
              <HeaderTitle
                withPadding={width <= mediaDimensions.mobile && !loggedIn}
              >
                <IconPadding>
                  <Cpu color={'white'} />
                </IconPadding>
                ThunderHub
              </HeaderTitle>
            </Link>
            <SingleLine>
              {loggedIn ? renderLoggedIn() : renderLoggedOut()}
            </SingleLine>
          </HeaderWrapper>
        </HeaderStyle>
      </Section>
      {open && width <= mediaDimensions.mobile && (
        <BurgerMenu open={open} setOpen={setOpen} />
      )}
    </>
  );
};
