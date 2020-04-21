import React, { useState } from 'react';
import {
  Headline,
  LeftHeadline,
  StyledImage,
  HomeButton,
  HomeTitle,
  HomeText,
} from '../HomePage.styled';
import { Zap } from '../../../components/generic/Icons';
import { headerColor, inverseTextColor } from '../../../styles/Themes';
import { Section } from '../../../components/section/Section';
import {
  FullWidth,
  Padding,
  SlantedWrapper,
  SlantedEdge,
} from './Sections.styled';
import { Link } from '../../../components/link/Link';
import { useTransition, animated, config } from 'react-spring';
import { ViewSwitch } from '../../../components/viewSwitch/ViewSwitch';

export const TopSection = () => {
  const [state] = useState(true);

  const transition = useTransition(state, null, {
    config: config.slow,
    from: { transform: 'translate3d(-80px,0,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
  });

  const transition2 = useTransition(state, null, {
    config: config.slow,
    from: { transform: 'translate3d(80px,0,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
  });

  const renderButton = () => (
    <FullWidth>
      <Link to="/login" underline={'transparent'}>
        <HomeButton>
          <Padding>
            <Zap fillcolor={'white'} color={'white'} />
          </Padding>
          Control The Lightning
        </HomeButton>
      </Link>
    </FullWidth>
  );

  return (
    <>
      <Section color={headerColor} textColor={inverseTextColor}>
        <Headline>
          <LeftHeadline>
            {transition.map(({ props }) => (
              <animated.div style={props}>
                <HomeTitle>Control the Lightning</HomeTitle>
                <FullWidth>
                  <HomeText>
                    Monitor and manage your node from any browser and any
                    device.
                  </HomeText>
                </FullWidth>
                <ViewSwitch hideMobile={true}>{renderButton()}</ViewSwitch>
              </animated.div>
            ))}
          </LeftHeadline>
          {transition2.map(({ props }) => (
            <animated.div style={props}>
              <StyledImage />
            </animated.div>
          ))}
          <ViewSwitch>
            {transition.map(({ props }) => (
              <animated.div style={{ marginTop: '16px', ...props }}>
                {renderButton()}
              </animated.div>
            ))}
          </ViewSwitch>
        </Headline>
      </Section>
      <SlantedWrapper>
        <SlantedEdge />
      </SlantedWrapper>
    </>
  );
};
